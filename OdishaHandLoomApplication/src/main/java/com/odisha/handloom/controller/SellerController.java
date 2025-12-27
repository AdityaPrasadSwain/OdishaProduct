package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Category;
import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.request.ProductRequest;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.repository.CategoryRepository;
import com.odisha.handloom.repository.ProductImageRepository;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.UUID;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/seller")
@PreAuthorize("hasRole('SELLER')")
public class SellerController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    private com.odisha.handloom.service.CaptionGeneratorService captionGeneratorService;

    @Autowired
    UserRepository userRepository;

    @Autowired

    CategoryRepository categoryRepository;

    @Autowired
    ProductImageRepository productImageRepository;

    @Autowired
    com.odisha.handloom.service.CloudinaryService cloudinaryService;

    @Autowired
    private com.odisha.handloom.service.StockService stockService;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(SellerController.class);

    @PostMapping(value = "/products", consumes = { "multipart/form-data" })
    public ResponseEntity<?> addProduct(
            @jakarta.validation.Valid @RequestPart("product") ProductRequest productRequest,
            @RequestPart(value = "images", required = false) List<org.springframework.web.multipart.MultipartFile> images,
            @RequestPart(value = "reel", required = false) org.springframework.web.multipart.MultipartFile reel) {

        logger.info("Received addProduct request: {}", productRequest);
        logger.info("Received images: {}", images != null ? images.size() : "null");

        // Validation for Images
        if (images == null || images.isEmpty()) {
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {
                {
                    put("field", "images");
                    put("message", "At least one product image is required.");
                }
            });
        }

        if (images.size() > 8) {
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {
                {
                    put("field", "images");
                    put("message", "Maximum 8 images allowed per product.");
                }
            });
        }

        if (images != null) {
            for (org.springframework.web.multipart.MultipartFile image : images) {
                // Validate Image Size (2MB)
                if (image.getSize() > 2 * 1024 * 1024) {
                    return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {
                        {
                            put("field", "images");
                            put("message", "Each image must be less than 2MB.");
                        }
                    });
                }
                String contentType = image.getContentType();
                if (contentType == null
                        || !List.of("image/jpeg", "image/png", "image/webp", "image/jpg")
                                .contains(contentType.toLowerCase())) {
                    return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {
                        {
                            put("field", "images");
                            put("message", "Invalid image format. Please upload JPG, PNG, or WEBP.");
                        }
                    });
                }
            }
        }

        if (reel != null && !reel.isEmpty()) {
            if (reel.getSize() > 50 * 1024 * 1024) { // 50MB Limit
                return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {
                    {
                        put("field", "reel");
                        put("message", "Reel video must be less than 50MB.");
                    }
                });
            }
            String contentType = reel.getContentType();
            if (contentType == null || !contentType.startsWith("video/")) {
                return ResponseEntity.badRequest().body(new java.util.HashMap<String, String>() {
                    {
                        put("field", "reel");
                        put("message", "Invalid video format.");
                    }
                });
            }
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User seller = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Seller not found"));

        if (!seller.isApproved()) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body(new java.util.HashMap<String, String>() {
                        {
                            put("message", "Seller not approved by admin");
                            put("error", "Account Pending Approval");
                        }
                    });
        }

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Error: Category not found"));

        // Build Product
        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .discountPrice(productRequest.getDiscountPrice())
                .stockQuantity(productRequest.getStockQuantity())
                .category(category)
                .seller(seller)
                .isApproved(true)
                .material(productRequest.getMaterial())
                .color(productRequest.getColor())
                .size(productRequest.getSize())
                .origin(productRequest.getOrigin())
                .packOf(productRequest.getPackOf())
                .origin(productRequest.getOrigin())
                .packOf(productRequest.getPackOf())
                .build();

        logger.info("Building product with attributes - Material: {}, Color: {}, Size: {}, Origin: {}, PackOf: {}",
                productRequest.getMaterial(), productRequest.getColor(), productRequest.getSize(),
                productRequest.getOrigin(), productRequest.getPackOf());

        // Save Product First (Generate ID)
        Product savedProduct = productRepository.save(product);
        logger.info("Product created with ID: {}", savedProduct.getId());

        try {
            for (int i = 0; i < images.size(); i++) {
                org.springframework.web.multipart.MultipartFile image = images.get(i);
                logger.info("Uploading image {}/{}", i + 1, images.size());
                String url = cloudinaryService.uploadImage(image);
                logger.info("Uploaded image to Cloudinary: {}", url);

                com.odisha.handloom.entity.ProductImage pImage = new com.odisha.handloom.entity.ProductImage();
                pImage.setImageUrl(url);
                pImage.setPosition(i);
                pImage.setProduct(savedProduct);

                productImageRepository.save(pImage);
            }
        } catch (java.io.IOException e) {
            logger.error("Error uploading image to Cloudinary", e);
            // Optional: Delete product if image upload fails?
            // productRepository.delete(savedProduct);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error uploading image: " + e.getMessage()));
        }

        logger.info("All images saved for product: {}", savedProduct.getId());

        // Upload Reel if exists
        try {
            if (reel != null && !reel.isEmpty()) {
                logger.info("Uploading reel video...");
                String reelUrl = cloudinaryService.uploadVideo(reel);
                logger.info("Reel uploaded: {}", reelUrl);
                savedProduct.setReelUrl(reelUrl);

                // Auto-generate caption using AI Service
                String caption = captionGeneratorService.generateCaption(savedProduct);
                savedProduct.setReelCaption(caption);

                productRepository.save(savedProduct);
            }
        } catch (java.io.IOException e) {
            logger.error("Error uploading reel", e);
            return ResponseEntity.badRequest().body(new MessageResponse("Error uploading reel: " + e.getMessage()));
        }

        return ResponseEntity.ok(new MessageResponse("Product added successfully!"));
    }

    @GetMapping("/products")
    public List<Product> getMyProducts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        logger.info("Fetching products for seller: {}", email);

        User seller = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Seller not found"));
        logger.info("Seller ID: {}", seller.getId());
        List<Product> products = productRepository.findBySellerId(seller.getId());

        logger.info("Found {} products for seller {}", products.size(), email);
        return products;
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable UUID id, @RequestBody ProductRequest productRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User seller = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Seller not found"));

        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You are not authorized to update this product"));
        }

        // Check for stock refill logic
        boolean wasOutOfStock = product.getStockQuantity() <= 0;

        product.setStockQuantity(productRequest.getStockQuantity());

        // Update other fields
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setDiscountPrice(productRequest.getDiscountPrice());
        product.setMaterial(productRequest.getMaterial());
        product.setColor(productRequest.getColor());
        product.setSize(productRequest.getSize());
        product.setOrigin(productRequest.getOrigin());
        product.setPackOf(productRequest.getPackOf());

        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Error: Category not found"));
        product.setCategory(category);

        // Update isOutOfStock status
        if (product.getStockQuantity() > 0) {
            product.setOutOfStock(false);
        } else {
            product.setOutOfStock(true);
        }

        Product savedProduct = productRepository.save(product);

        // Trigger notifications if restocked
        if (wasOutOfStock && savedProduct.getStockQuantity() > 0) {
            stockService.notifySubscribers(savedProduct);
        }

        return ResponseEntity.ok(new MessageResponse("Product updated successfully!"));
    }

    @Autowired
    com.odisha.handloom.repository.OrderItemRepository orderItemRepository;

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User seller = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Seller not found"));

        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You are not authorized to delete this product"));
        }

        if (orderItemRepository.existsByProduct_Id(id)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Cannot delete product. It is part of existing orders."));
        }

        productRepository.delete(product);
        return ResponseEntity.ok(new MessageResponse("Product deleted successfully!"));
    }
}
