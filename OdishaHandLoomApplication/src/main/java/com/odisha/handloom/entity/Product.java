package com.odisha.handloom.entity;

import com.odisha.handloom.enums.ProductStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
@lombok.Getter
@lombok.Setter
@lombok.Builder
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@lombok.EqualsAndHashCode(onlyExplicitlyIncluded = true)
@lombok.ToString(onlyExplicitlyIncluded = true)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @lombok.EqualsAndHashCode.Include
    @lombok.ToString.Include
    private UUID id;

    @Column(nullable = false)
    @lombok.ToString.Include
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @lombok.Builder.Default
    private ProductStatus status = ProductStatus.DRAFT;

    private BigDecimal discountPrice;

    @jakarta.validation.constraints.Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    @Version
    @lombok.Builder.Default
    private Long version = 0L;

    private String material;
    private String color;
    private String size;
    private String origin; // e.g. Sambalpuri, Pipili
    private String packOf;

    private String reelUrl;

    @Column(columnDefinition = "TEXT")
    private String reelCaption;

    @Column(columnDefinition = "TEXT")
    private String classificationData;

    @Column(columnDefinition = "TEXT")
    private String specifications;

    @lombok.Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("position ASC")
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<ProductImage> images = new java.util.ArrayList<>();

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private ProductPricing pricing;

    @lombok.Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<ProductSpecification> specsList = new java.util.ArrayList<>();

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private ProductPolicy policy;

    public void addImage(ProductImage image) {
        images.add(image);
        image.setProduct(this);
    }

    public void removeImage(ProductImage image) {
        images.remove(image);
        image.setProduct(null);
    }

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "is_approved", nullable = false)
    @lombok.Builder.Default
    private boolean isApproved = false;

    @Column(name = "is_out_of_stock", nullable = false)
    @lombok.Builder.Default
    private boolean isOutOfStock = false;

    @PrePersist
    public void onPrePersist() {
        if (this.status == null) {
            this.status = ProductStatus.DRAFT;
        }
        if (this.price == null) {
            this.price = BigDecimal.ZERO;
        }
        syncOutOfStock();
    }

    @PreUpdate
    public void syncOutOfStock() {
        this.isOutOfStock = this.stockQuantity == null || this.stockQuantity <= 0;
    }

    public void activateProduct() {
        if (this.price == null || this.price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("Cannot activate product with invalid price (must be > 0)");
        }
        this.status = ProductStatus.ACTIVE;
    }

    // Custom getters/setters removed as Lombok handles primitive boolean is/set
    // correctly

    // Rating cache (optional, but easier for sorting/showing)
    @lombok.Builder.Default
    private Double averageRating = 0.0;
    @lombok.Builder.Default
    private Integer totalReviews = 0;
}
