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
    private com.odisha.handloom.service.ImageStorageService imageStorageService;

    @Autowired
    com.odisha.handloom.service.CloudinaryService cloudinaryService;

    @Autowired
    private com.odisha.handloom.service.StockService stockService;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(SellerController.class);

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private String convertMapToJson(java.util.Map<String, Object> map) {
        if (map == null)
            return null;
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            logger.error("Error converting specifications to JSON", e);
            return "{}";
        }
    }

    // LEGACY - DEPRECATED via Implementation Plan to enforce Product Wizard
    // @PostMapping(value = "/products", consumes = { "multipart/form-data" })
    public ResponseEntity<?> addProduct(
            @jakarta.validation.Valid @RequestPart("product") ProductRequest productRequest,
            @RequestPart(value = "images", required = false) List<org.springframework.web.multipart.MultipartFile> images,
            @RequestPart(value = "reel", required = false) org.springframework.web.multipart.MultipartFile reel) {
        return ResponseEntity.status(HttpStatus.GONE)
                .body(new MessageResponse("This endpoint is deprecated. Use the Product Wizard at /api/products"));
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
        logger.info("Found {} products for seller {}", products.size(), email);
        return products;
    }

    @GetMapping("/products/drafts")
    public List<Product> getDrafts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User seller = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Seller not found"));
        return productRepository.findBySellerIdAndStatus(seller.getId(), com.odisha.handloom.enums.ProductStatus.DRAFT);
    }

    // LEGACY - DEPRECATED
    // @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable UUID id, @RequestBody ProductRequest productRequest) {
        return ResponseEntity.status(HttpStatus.GONE)
                .body(new MessageResponse("This endpoint is deprecated. Use the Product Wizard update endpoints."));
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
