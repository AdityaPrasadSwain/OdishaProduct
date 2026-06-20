package com.odisha.handloom.entity;

import jakarta.persistence.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "product_pricing")
@lombok.Getter
@lombok.Setter
@lombok.Builder
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
@lombok.EqualsAndHashCode(onlyExplicitlyIncluded = true)
@lombok.ToString(onlyExplicitlyIncluded = true)
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class ProductPricing {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @lombok.EqualsAndHashCode.Include
    @lombok.ToString.Include
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
