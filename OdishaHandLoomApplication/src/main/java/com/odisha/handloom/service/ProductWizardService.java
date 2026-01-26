package com.odisha.handloom.service;

import com.odisha.handloom.dto.productwizard.*;
import com.odisha.handloom.entity.*;
import com.odisha.handloom.enums.ProductStatus;
import com.odisha.handloom.repository.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductWizardService {

    private final ProductRepository productRepository;
    private final ProductPricingRepository pricingRepository;
    private final ProductPolicyRepository policyRepository;

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // Injected via @RequiredArgsConstructor (Constructor Injection)
    private final ImageStorageService imageStorageService;

    @Transactional
    public Product createProductStep1(ProductBasicInfoRequest request, String sellerId) {
        Product product = new Product();
        product.setStatus(ProductStatus.DRAFT);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setMaterial(request.getMaterial());
        product.setColor(request.getColor());
        product.setSize(request.getSize());
        product.setOrigin(request.getOrigin());
        product.setPackOf(request.getPackOf());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(UUID.fromString(request.getCategoryId()))
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        // Assign seller
        User seller;
        if (sellerId != null && !sellerId.isEmpty()) {
            seller = userRepository.findById(UUID.fromString(sellerId))
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
        } else {
            // Use logged-in user
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                throw new RuntimeException("User is not authenticated");
            }
            String email = auth.getName();
            seller = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
        }
        product.setSeller(seller);

        return productRepository.save(product);
    }

    @Transactional
    public void updateBasicInfoStep1(UUID productId, ProductBasicInfoRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setMaterial(request.getMaterial());
        product.setColor(request.getColor());
        product.setSize(request.getSize());
        product.setOrigin(request.getOrigin());
        product.setPackOf(request.getPackOf());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(UUID.fromString(request.getCategoryId()))
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        productRepository.save(product);
    }

    @Transactional
    public void updatePricingStep2(UUID productId, ProductPricingRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductPricing pricing = pricingRepository.findByProduct_Id(productId)
                .orElse(new ProductPricing());

        pricing.setProduct(product);
        pricing.setPrice(request.getPrice());
        pricing.setDiscountPrice(request.getDiscountPrice());
        pricing.setStockQuantity(request.getStockQuantity());
        pricing.setMinOrderQuantity(request.getMinOrderQuantity());
        pricing.setMaxOrderQuantity(request.getMaxOrderQuantity());
        pricing.setIsCodAvailable(request.getIsCodAvailable());

        pricingRepository.save(pricing);

        // Sync with Product entity for backward compatibility
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        productRepository.save(product);
    }

    @Transactional
    public void updateImagesStep3(UUID productId, List<MultipartFile> newImages, List<String> keptImages,
            MultipartFile reel) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2. Identify images to remove
        List<ProductImage> toRemove = new java.util.ArrayList<>(product.getImages());
        if (keptImages != null) {
            toRemove.removeIf(img -> keptImages.contains(img.getImagePath()));
        } else {
            // If keptImages is null/empty, it means user removed ALL existing images
        }

        product.getImages().removeAll(toRemove);

        // 3. Upload and add NEW images
        int currentMaxPos = product.getImages().stream()
                .mapToInt(ProductImage::getPosition)
                .max().orElse(-1);
        int pos = currentMaxPos + 1;

        if (newImages != null) {
            for (MultipartFile file : newImages) {
                try {
                    String path = imageStorageService.store(file, product.getId().toString());
                    ProductImage img = new ProductImage();
                    img.setImagePath(path);
                    img.setPosition(pos++);
                    img.setProduct(product); // Ensure relationship
                    product.addImage(img);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to upload image: " + e.getMessage());
                }
            }
        }

        // Upload Reel if provided
        if (reel != null && !reel.isEmpty()) {
            try {
                String reelUrl = imageStorageService.store(reel, product.getId().toString());
                product.setReelUrl(reelUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload reel: " + e.getMessage());
            }
        }

        // 4. Re-normalize positions (Optional but good practice)
        int p = 0;
        for (ProductImage img : product.getImages()) {
            img.setPosition(p++);
        }

        productRepository.save(product);
    }

    @Transactional
    public void updateSpecsStep4(UUID productId, List<ProductSpecEntry> specs) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Use orphanRemoval to clear old specs
        product.getSpecsList().clear();

        for (ProductSpecEntry entry : specs) {
            ProductSpecification spec = new ProductSpecification();
            spec.setSpecKey(entry.getKey());
            spec.setSpecValue(entry.getValue());
            // Manual set needed for bidirectional relationship if helper missing
            spec.setProduct(product);
            product.getSpecsList().add(spec);
        }

        productRepository.save(product);
    }

    @Transactional
    public void updatePolicyStep5(UUID productId, ProductPolicyRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductPolicy policy = policyRepository.findByProduct_Id(productId)
                .orElse(new ProductPolicy());

        policy.setProduct(product);
        policy.setDispatchDays(request.getDispatchDays());
        policy.setReturnAvailable(request.getReturnAvailable());
        policy.setReturnWindowDays(request.getReturnWindowDays());
        policy.setReturnPolicyDescription(request.getReturnPolicyDescription());
        policy.setCancellationAvailable(request.getCancellationAvailable());

        policyRepository.save(policy);
    }

    @Transactional(readOnly = true)
    public com.odisha.handloom.dto.productwizard.ProductSummaryDto getProductSummary(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        com.odisha.handloom.dto.productwizard.ProductSummaryDto dto = new com.odisha.handloom.dto.productwizard.ProductSummaryDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
        }
        dto.setMaterial(product.getMaterial());
        dto.setColor(product.getColor());
        dto.setSize(product.getSize());
        dto.setOrigin(product.getOrigin());
        dto.setPackOf(product.getPackOf());

        if (product.getPricing() != null) {
            dto.setPrice(product.getPricing().getPrice());
            dto.setDiscountPrice(product.getPricing().getDiscountPrice());
            dto.setStockQuantity(product.getPricing().getStockQuantity());
            dto.setMinOrderQuantity(product.getPricing().getMinOrderQuantity());
            dto.setMaxOrderQuantity(product.getPricing().getMaxOrderQuantity());
            dto.setIsCodAvailable(product.getPricing().getIsCodAvailable());
        }

        dto.setImageUrls(product.getImages().stream()
                .sorted((a, b) -> a.getPosition().compareTo(b.getPosition()))
                .map(img -> img.getImagePath()) // Cloudinary returns full URL now
                .collect(Collectors.toList()));

        dto.setReelUrl(product.getReelUrl());

        dto.setSpecifications(product.getSpecsList().stream()
                .map(s -> new ProductSpecEntry(s.getSpecKey(), s.getSpecValue()))
                .collect(Collectors.toList()));

        if (product.getPolicy() != null) {
            dto.setDispatchDays(product.getPolicy().getDispatchDays());
            dto.setReturnAvailable(product.getPolicy().getReturnAvailable());
            dto.setReturnWindowDays(product.getPolicy().getReturnWindowDays());
            dto.setReturnPolicyDescription(product.getPolicy().getReturnPolicyDescription());
            dto.setCancellationAvailable(product.getPolicy().getCancellationAvailable());
        }

        return dto;
    }

    @Transactional
    public void publishProduct(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.activateProduct();
        product.setApproved(true);
        product.syncOutOfStock();

        productRepository.save(product);
    }
}
