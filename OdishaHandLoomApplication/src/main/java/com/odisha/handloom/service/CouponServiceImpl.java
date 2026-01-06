package com.odisha.handloom.service;

import com.odisha.handloom.dto.coupon.ApplyCouponRequest;
import com.odisha.handloom.dto.coupon.CouponDto;
import com.odisha.handloom.dto.coupon.CouponValidationResponse;
import com.odisha.handloom.entity.Coupon;
import com.odisha.handloom.entity.CouponUsage;
import com.odisha.handloom.entity.Order;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.enums.DiscountType;
import com.odisha.handloom.repository.CouponRepository;
import com.odisha.handloom.repository.CouponUsageRepository;
import com.odisha.handloom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CouponDto createCoupon(CouponDto couponDto) {
        if (couponRepository.existsByCode(couponDto.getCode())) {
            throw new RuntimeException("Coupon code already exists");
        }

        Coupon coupon = Coupon.builder()
                .code(couponDto.getCode()) // PrePersist will handle uppercase
                .description(couponDto.getDescription())
                .discountType(couponDto.getDiscountType())
                .discountValue(couponDto.getDiscountValue())
                .minOrderAmount(couponDto.getMinOrderAmount())
                .maxDiscountAmount(couponDto.getMaxDiscountAmount())
                .startDate(couponDto.getStartDate())
                .expiryDate(couponDto.getExpiryDate())
                .usageLimitPerUser(couponDto.getUsageLimitPerUser())
                .globalUsageLimit(couponDto.getGlobalUsageLimit())
                .globalUsageCount(0)
                .isActive(couponDto.getIsActive() != null ? couponDto.getIsActive() : true)
                .build();

        Coupon saved = couponRepository.save(coupon);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public CouponDto updateCoupon(UUID id, CouponDto couponDto) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        if (couponDto.getDescription() != null)
            coupon.setDescription(couponDto.getDescription());
        if (couponDto.getDiscountType() != null)
            coupon.setDiscountType(couponDto.getDiscountType());
        if (couponDto.getDiscountValue() != null)
            coupon.setDiscountValue(couponDto.getDiscountValue());
        if (couponDto.getMinOrderAmount() != null)
            coupon.setMinOrderAmount(couponDto.getMinOrderAmount());
        if (couponDto.getMaxDiscountAmount() != null)
            coupon.setMaxDiscountAmount(couponDto.getMaxDiscountAmount());
        if (couponDto.getStartDate() != null)
            coupon.setStartDate(couponDto.getStartDate());
        if (couponDto.getExpiryDate() != null)
            coupon.setExpiryDate(couponDto.getExpiryDate());
        if (couponDto.getUsageLimitPerUser() != null)
            coupon.setUsageLimitPerUser(couponDto.getUsageLimitPerUser());
        if (couponDto.getGlobalUsageLimit() != null)
            coupon.setGlobalUsageLimit(couponDto.getGlobalUsageLimit());
        if (couponDto.getIsActive() != null)
            coupon.setIsActive(couponDto.getIsActive());

        return mapToDto(couponRepository.save(coupon));
    }

    @Override
    public void deleteCoupon(UUID id) {
        couponRepository.deleteById(id);
    }

    @Override
    public CouponDto getCouponById(UUID id) {
        return couponRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
    }

    @Override
    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CouponDto toggleCouponStatus(UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setIsActive(!coupon.getIsActive());
        return mapToDto(couponRepository.save(coupon));
    }

    @Override
    public Map<String, Object> getCouponStats(UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsage", coupon.getGlobalUsageCount());
        stats.put("remainingUsage", coupon.getGlobalUsageLimit() - coupon.getGlobalUsageCount());
        return stats;
    }

    @Override
    public CouponValidationResponse applyCoupon(ApplyCouponRequest request, UUID userId) {
        try {
            Coupon coupon = couponRepository.findByCode(request.getCouponCode().toUpperCase())
                    .orElseThrow(() -> new RuntimeException("Invalid coupon code"));

            validateCouponRules(coupon, request.getOrderAmount(), userId);

            BigDecimal discount = calculateDiscount(coupon, request.getOrderAmount());
            BigDecimal finalAmount = request.getOrderAmount().subtract(discount);
            if (finalAmount.compareTo(BigDecimal.ZERO) < 0)
                finalAmount = BigDecimal.ZERO;

            return CouponValidationResponse.builder()
                    .valid(true)
                    .message("Coupon applied successfully")
                    .code(coupon.getCode())
                    .discountAmount(discount)
                    .originalAmount(request.getOrderAmount())
                    .finalAmount(finalAmount)
                    .build();

        } catch (RuntimeException e) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .message(e.getMessage())
                    .discountAmount(BigDecimal.ZERO)
                    .originalAmount(request.getOrderAmount())
                    .finalAmount(request.getOrderAmount())
                    .build();
        }
    }

    @Override
    @Transactional
    public void recordCouponUsage(String code, Order order, User user) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        coupon.setGlobalUsageCount(coupon.getGlobalUsageCount() + 1);

        if (coupon.getGlobalUsageCount() >= coupon.getGlobalUsageLimit()) {
            coupon.setIsActive(false);
            log.info("Coupon {} auto-disabled due to usage limit reached", coupon.getCode());
        }

        couponRepository.save(coupon);

        CouponUsage usage = CouponUsage.builder()
                .coupon(coupon)
                .user(user)
                .order(order)
                .discountAmount(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO)
                .orderTotalBeforeDiscount(order.getTotalAmount()
                        .add(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO))
                .orderTotalAfterDiscount(order.getTotalAmount())
                .build();

        couponUsageRepository.save(usage);
    }

    @Override
    public boolean isCouponValidForUser(String code, UUID userId) {
        try {
            Coupon coupon = couponRepository.findByCode(code)
                    .orElseThrow(() -> new RuntimeException("Invalid code"));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            checkUsageLimits(coupon, user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Helpers
    private void validateCouponRules(Coupon coupon, BigDecimal orderAmount, UUID userId) {
        if (!coupon.getIsActive())
            throw new RuntimeException("Coupon is inactive");
        if (LocalDateTime.now().isBefore(coupon.getStartDate()))
            throw new RuntimeException("Coupon is not yet active");
        if (LocalDateTime.now().isAfter(coupon.getExpiryDate()))
            throw new RuntimeException("Coupon has expired");
        if (coupon.getGlobalUsageCount() >= coupon.getGlobalUsageLimit())
            throw new RuntimeException("Coupon usage limit reached");
        if (orderAmount.compareTo(coupon.getMinOrderAmount()) < 0)
            throw new RuntimeException("Minimum order amount not reached. Min: " + coupon.getMinOrderAmount());

        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            checkUsageLimits(coupon, user);
        }
    }

    private void checkUsageLimits(Coupon coupon, User user) {
        long userUsage = couponUsageRepository.countByCouponAndUser(coupon, user);
        if (userUsage >= coupon.getUsageLimitPerUser()) {
            throw new RuntimeException("You have reached the usage limit for this coupon");
        }
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount) {
        BigDecimal discount;
        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = orderAmount.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else {
            discount = coupon.getDiscountValue();
        }
        if (discount.compareTo(orderAmount) > 0)
            discount = orderAmount;
        return discount.setScale(2, RoundingMode.HALF_UP);
    }

    private CouponDto mapToDto(Coupon coupon) {
        return CouponDto.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .description(coupon.getDescription())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .minOrderAmount(coupon.getMinOrderAmount())
                .maxDiscountAmount(coupon.getMaxDiscountAmount())
                .startDate(coupon.getStartDate())
                .expiryDate(coupon.getExpiryDate())
                .usageLimitPerUser(coupon.getUsageLimitPerUser())
                .globalUsageLimit(coupon.getGlobalUsageLimit())
                .globalUsageCount(coupon.getGlobalUsageCount())
                .isActive(coupon.getIsActive())
                .createdAt(coupon.getCreatedAt())
                .updatedAt(coupon.getUpdatedAt())
                .build();
    }
}
