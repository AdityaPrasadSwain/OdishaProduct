package com.odisha.handloom.controller;

import com.odisha.handloom.dto.coupon.ApplyCouponRequest;
import com.odisha.handloom.dto.coupon.CouponDto;
import com.odisha.handloom.dto.coupon.CouponValidationResponse;
import com.odisha.handloom.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Coupon Engine", description = "Operations related to Coupon Management and Application")
public class CouponController {

    private final CouponService couponService;

    // --- PUBLIC / USER ENDPOINTS ---

    @PostMapping("/coupons/apply")
    @Operation(summary = "Apply a coupon", description = "Validate and preview coupon discount for an order")
    public ResponseEntity<CouponValidationResponse> applyCoupon(
            @RequestBody ApplyCouponRequest request,
            @RequestParam(required = false) UUID userId) {
        return ResponseEntity.ok(couponService.applyCoupon(request, userId));
    }

    @GetMapping("/coupons/usage/user/{userId}")
    @Operation(summary = "Get user coupon usage", description = "Retrieve history of coupons used by a specific user")
    public ResponseEntity<Boolean> checkCouponValidityForUser(
            @RequestParam String code,
            @PathVariable UUID userId) {
        return ResponseEntity.ok(couponService.isCouponValidForUser(code, userId));
    }

    // --- ADMIN ENDPOINTS ---

    @GetMapping("/admin/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all coupons", description = "Retrieve a list of all coupons (Admin only)")
    public ResponseEntity<List<CouponDto>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @PostMapping("/admin/coupons")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new coupon", description = "Create a new coupon with rules")
    public ResponseEntity<CouponDto> createCoupon(@RequestBody CouponDto couponDto) {
        return ResponseEntity.ok(couponService.createCoupon(couponDto));
    }

    @GetMapping("/admin/coupons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get coupon by ID", description = "Retrieve detailed information of a specific coupon")
    public ResponseEntity<CouponDto> getCouponById(@PathVariable UUID id) {
        return ResponseEntity.ok(couponService.getCouponById(id));
    }

    @PutMapping("/admin/coupons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update coupon", description = "Update details of an existing coupon")
    public ResponseEntity<CouponDto> updateCoupon(@PathVariable UUID id, @RequestBody CouponDto couponDto) {
        return ResponseEntity.ok(couponService.updateCoupon(id, couponDto));
    }

    @DeleteMapping("/admin/coupons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete coupon", description = "Permanently delete a coupon")
    public ResponseEntity<Void> deleteCoupon(@PathVariable UUID id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/admin/coupons/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle coupon status", description = "Enable or disable a coupon")
    public ResponseEntity<CouponDto> toggleCouponStatus(@PathVariable UUID id) {
        return ResponseEntity.ok(couponService.toggleCouponStatus(id));
    }

    @GetMapping("/admin/coupons/{id}/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get coupon statistics", description = "Get usage stats for a specific coupon")
    public ResponseEntity<Map<String, Object>> getCouponStats(@PathVariable UUID id) {
        return ResponseEntity.ok(couponService.getCouponStats(id));
    }
}
