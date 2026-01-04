package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "review_images")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @Column(nullable = false)
    private String imageUrl;

    public UUID getId() {
        return id;
    }

    public Review getReview() {
        return review;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
