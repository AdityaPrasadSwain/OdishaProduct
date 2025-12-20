package com.odisha.handloom.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int rating; // 1 to 5

    @Column(length = 1000)
    private String comment;

    // For Seller reply
    @Column(length = 1000)
    private String reply;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Review() {
    }

    public Review(UUID id, User user, Product product, int rating, String comment, String reply,
            LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.product = product;
        this.rating = rating;
        this.comment = comment;
        this.reply = reply;
        this.createdAt = createdAt;
    }

    public static ReviewBuilder builder() {
        return new ReviewBuilder();
    }

    public static class ReviewBuilder {
        private UUID id;
        private User user;
        private Product product;
        private int rating;
        private String comment;
        private String reply;
        private LocalDateTime createdAt;

        ReviewBuilder() {
        }

        public ReviewBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public ReviewBuilder user(User user) {
            this.user = user;
            return this;
        }

        public ReviewBuilder product(Product product) {
            this.product = product;
            return this;
        }

        public ReviewBuilder rating(int rating) {
            this.rating = rating;
            return this;
        }

        public ReviewBuilder comment(String comment) {
            this.comment = comment;
            return this;
        }

        public ReviewBuilder reply(String reply) {
            this.reply = reply;
            return this;
        }

        public ReviewBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Review build() {
            return new Review(id, user, product, rating, comment, reply, createdAt);
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
