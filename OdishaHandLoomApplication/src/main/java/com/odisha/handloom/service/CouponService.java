package com.odisha.handloom.service;

import com.odisha.handloom.dto.coupon.ApplyCouponRequest;
import com.odisha.handloom.dto.coupon.CouponDto;
import com.odisha.handloom.dto.coupon.CouponValidationResponse;
import com.odisha.handloom.entity.Order;
import com.odisha.handloom.entity.User;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface CouponService {

    // Admin Operations
    CouponDto createCoupon(CouponDto couponDto);

    CouponDto updateCoupon(UUID id, CouponDto couponDto);

    void deleteCoupon(UUID id);

    CouponDto getCouponById(UUID id);

    List<CouponDto> getAllCoupons();

    CouponDto toggleCouponStatus(UUID id);

    Map<String, Object> getCouponStats(UUID id);

    // User / Order Operations
    CouponValidationResponse applyCoupon(ApplyCouponRequest request, UUID userId); // Preview

    void recordCouponUsage(String code, Order order, User user); // Finalize

    boolean isCouponValidForUser(String code, UUID userId);
}
