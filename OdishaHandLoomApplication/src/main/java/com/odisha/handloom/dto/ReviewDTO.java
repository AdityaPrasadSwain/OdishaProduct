package com.odisha.handloom.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class ReviewDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {
        private UUID productId;
        private UUID orderItemId; // Verified purchase check
        private int rating;
        private String comment;
        private List<String> images;

        public UUID getProductId() {
            return productId;
        }

        public UUID getOrderItemId() {
            return orderItemId;
        }

        public int getRating() {
            return rating;
        }

        public String getComment() {
            return comment;
        }

        public List<String> getImages() {
            return images;
        }

        public void setProductId(UUID productId) {
            this.productId = productId;
        }

        public void setOrderItemId(UUID orderItemId) {
            this.orderItemId = orderItemId;
        }

        public void setRating(int rating) {
            this.rating = rating;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public void setImages(List<String> images) {
            this.images = images;
        }

        public String getReviewText() {
            return comment;
        }

        public void setReviewText(String reviewText) {
            this.comment = reviewText;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private UUID id;
        private String customerName;
        private int rating;
        private String reviewText;
        private List<String> imageUrls;
        private LocalDateTime createdAt;
        private boolean edited;

        public UUID getId() {
            return id;
        }

        public String getCustomerName() {
            return customerName;
        }

        public int getRating() {
            return rating;
        }

        public String getReviewText() {
            return reviewText;
        }

        public List<String> getImageUrls() {
            return imageUrls;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public boolean isEdited() {
            return edited;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public void setCustomerName(String customerName) {
            this.customerName = customerName;
        }

        public void setRating(int rating) {
            this.rating = rating;
        }

        public void setReviewText(String reviewText) {
            this.reviewText = reviewText;
        }

        public void setImageUrls(List<String> imageUrls) {
            this.imageUrls = imageUrls;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public void setEdited(boolean edited) {
            this.edited = edited;
        }
    }
}
