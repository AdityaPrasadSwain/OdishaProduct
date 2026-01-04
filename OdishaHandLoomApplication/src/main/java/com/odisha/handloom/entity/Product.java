package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
@Data
@lombok.Builder
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

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
    private Boolean isApproved = false;

    @Column(name = "is_out_of_stock", nullable = false)
    @lombok.Builder.Default
    private Boolean isOutOfStock = false;

    @PrePersist
    @PreUpdate
    public void syncOutOfStock() {
        this.isOutOfStock = this.stockQuantity == null || this.stockQuantity <= 0;
    }

    // Custom getter to return primitive boolean (safe)
    public boolean isOutOfStock() {
        return Boolean.TRUE.equals(this.isOutOfStock);
    }

    public void setOutOfStock(boolean outOfStock) {
        this.isOutOfStock = outOfStock;
    }

    // Rating cache (optional, but easier for sorting/showing)
    @lombok.Builder.Default
    private Double averageRating = 0.0;
    @lombok.Builder.Default
    private Integer totalReviews = 0;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isApproved() {
        return Boolean.TRUE.equals(isApproved);
    }

    public void setApproved(Boolean approved) {
        isApproved = approved;
    }

    public String getReelCaption() {
        return reelCaption;
    }

    public void setReelCaption(String reelCaption) {
        this.reelCaption = reelCaption;
    }

    public String getReelUrl() {
        return reelUrl;
    }

    public void setReelUrl(String reelUrl) {
        this.reelUrl = reelUrl;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getPackOf() {
        return packOf;
    }

    public void setPackOf(String packOf) {
        this.packOf = packOf;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }
}
