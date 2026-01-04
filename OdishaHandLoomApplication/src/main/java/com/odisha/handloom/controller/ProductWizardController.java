package com.odisha.handloom.controller;

import com.odisha.handloom.dto.productwizard.*;
import com.odisha.handloom.entity.Product;
import com.odisha.handloom.service.ProductWizardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin("*") // Enable CORS for development
public class ProductWizardController {

    private final ProductWizardService productWizardService;

    @PostMapping
    public ResponseEntity<Product> createProductStep1(
            @Valid @RequestBody ProductBasicInfoRequest request,
            @RequestParam(required = false) String sellerId) {
        // sellerId might be passed from frontend context or query param
        Product product = productWizardService.createProductStep1(request, sellerId);
        return ResponseEntity.ok(product);
    }

    @PostMapping("/{id}/pricing")
    public ResponseEntity<Void> updatePricingStep2(
            @PathVariable UUID id,
            @Valid @RequestBody ProductPricingRequest request) {
        productWizardService.updatePricingStep2(id, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<Void> updateImagesStep3(
            @PathVariable UUID id,
            @RequestBody ProductImageRequest request) {
        productWizardService.updateImagesStep3(id, request.getImageUrls());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/specs")
    public ResponseEntity<Void> updateSpecsStep4(
            @PathVariable UUID id,
            @RequestBody ProductSpecificationRequest request) {
        productWizardService.updateSpecsStep4(id, request.getSpecifications());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/policy")
    public ResponseEntity<Void> updatePolicyStep5(
            @PathVariable UUID id,
            @RequestBody ProductPolicyRequest request) {
        productWizardService.updatePolicyStep5(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<ProductSummaryDto> getProductSummary(@PathVariable UUID id) {
        return ResponseEntity.ok(productWizardService.getProductSummary(id));
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<Void> publishProduct(@PathVariable UUID id) {
        productWizardService.publishProduct(id);
        return ResponseEntity.ok().build();
    }
}
