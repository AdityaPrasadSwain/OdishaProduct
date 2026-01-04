package com.odisha.handloom.service;

import com.odisha.handloom.dto.productwizard.*;
import com.odisha.handloom.entity.*;
import com.odisha.handloom.repository.*;
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
    private final ProductSpecificationRepository specRepository;
    private final ProductPolicyRepository policyRepository;
    private final ProductImageRepository imageRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public Product createProductStep1(ProductBasicInfoRequest request, String sellerId) {
        Product product = new Product();
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

        // Assign seller (For demo without auth, we need a valid seller)
        // We expect sellerId to be passed or we fetch a default
        User seller;
        if (sellerId != null && !sellerId.isEmpty()) {
            seller = userRepository.findById(UUID.fromString(sellerId))
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
        } else {
            // Fallback: fetch first available user or similar.
            // Ideally should fail if not provided, but per instructions, we must ensure it
            // works.
            seller = userRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("No users found to assign as seller"));
        }
        product.setSeller(seller);

        // Initialize other relations as null or default?
        // We will create them in subsequent steps.

        return productRepository.save(product);
    }

    @Transactional
    public void updatePricingStep2(UUID productId, ProductPricingRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductPricing pricing = pricingRepository.findByProductId(productId)
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
    public void updateImagesStep3(UUID productId, List<String> imageUrls) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Clear existing? Or append? Wizard usually overwrites or appends.
        // For simplicity, let's assume we replace or we add.
        // If we want to replace, we should delete old ones.
        // But Product.images has CascadeType.ALL, orphanRemoval=true.

        // We can just clear the list and add new ones.
        product.getImages().clear();

        int pos = 0;
        for (String url : imageUrls) {
            ProductImage img = new ProductImage();
            img.setImageUrl(url);
            img.setPosition(pos++);
            product.addImage(img);
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
            spec.setProduct(product); // Manual set needed?
            // Since we are adding to the list mapped by "product", we need to maintain
            // bidirectional relationship
            // The list in Product is: specsList
            // Helper method in product would be good, but we can do it here
            product.getSpecsList().add(spec); // This adds to list
        }

        // Since we modified the collection and it has CascadeType.ALL, saving product
        // should work.
        // IMPORTANT: We need to set the back-reference 'product' on the spec objects.
        // product.getSpecsList().add(spec) does NOT automatically set
        // spec.setProduct(product) unless we have a helper method.
        // Product.java likely doesn't have a helper for specsList yet. We just added
        // the field.

        for (ProductSpecification spec : product.getSpecsList()) {
            spec.setProduct(product);
        }

        productRepository.save(product);
    }

    @Transactional
    public void updatePolicyStep5(UUID productId, ProductPolicyRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductPolicy policy = policyRepository.findByProductId(productId)
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
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList()));

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

        // In a real app, this might set status to 'PENDING_APPROVAL'
        // For this demo wizard, make it live immediately:
        product.setApproved(true);
        product.syncOutOfStock();

        productRepository.save(product);
    }
}
