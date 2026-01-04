package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "product_pricing")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductPricing {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Product product;

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal discountPrice;

    private Integer stockQuantity;

    private Integer minOrderQuantity;
    private Integer maxOrderQuantity;

    private Boolean isCodAvailable;
}
