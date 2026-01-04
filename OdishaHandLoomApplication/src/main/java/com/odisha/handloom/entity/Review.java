package com.odisha.handloom.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "reviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "reviews" })
    private Product product;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false, unique = true)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private OrderItem orderItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "password", "orders" })
    private User customer;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(length = 1000)
    private String reviewText;

    @Column(nullable = false, columnDefinition = "boolean default false")
    @Builder.Default
    private Boolean edited = false;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<ReviewImage> images = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void addImage(ReviewImage image) {
        images.add(image);
        image.setReview(this);
    }

    public UUID getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public OrderItem getOrderItem() {
        return orderItem;
    }

    public User getCustomer() {
        return customer;
    }

    public Integer getRating() {
        return rating;
    }

    public String getReviewText() {
        return reviewText;
    }

    public boolean isEdited() {
        return Boolean.TRUE.equals(edited);
    }

    public List<ReviewImage> getImages() {
        return images;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public void setEdited(Boolean edited) {
        this.edited = edited;
    }

    public void setImages(List<ReviewImage> images) {
        this.images = images;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
