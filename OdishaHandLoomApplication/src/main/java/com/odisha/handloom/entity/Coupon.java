package com.odisha.handloom.entity;

import com.odisha.handloom.enums.DiscountType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType;

    @Column(nullable = false)
    private BigDecimal discountValue;

    private BigDecimal minOrderAmount;

    private BigDecimal maxDiscountAmount;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private Integer usageLimitPerUser;

    @Column(nullable = false)
    private Integer globalUsageLimit;

    @Column(nullable = false)
    @Builder.Default
    private Integer globalUsageCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Enforce uppercase via setter
    public void setCode(String code) {
        this.code = (code != null) ? code.toUpperCase() : null;
    }

    @PrePersist
    @PreUpdate
    protected void normalize() {
        if (this.code != null) {
            this.code = this.code.toUpperCase();
        }
        if (this.globalUsageCount == null) {
            this.globalUsageCount = 0;
        }
        if (this.isActive == null) {
            this.isActive = true;
        }
    }
}
