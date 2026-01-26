package com.odisha.handloom.controller;

import com.odisha.handloom.dto.productwizard.*;
import com.odisha.handloom.entity.Product;
import com.odisha.handloom.service.ProductWizardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.util.List;

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

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateImagesStep3(
            @PathVariable UUID id,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "keptImages", required = false) List<String> keptImages,
            @RequestParam(value = "reel", required = false) MultipartFile reel) {
        productWizardService.updateImagesStep3(id, images, keptImages, reel);
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

    @PatchMapping("/{id}/basic")
    public ResponseEntity<Void> updateBasicInfoStep1(
            @PathVariable UUID id,
            @RequestBody ProductBasicInfoRequest request) {
        productWizardService.updateBasicInfoStep1(id, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<Void> publishProduct(@PathVariable UUID id) {
        productWizardService.publishProduct(id);
        return ResponseEntity.ok().build();
    }
}
