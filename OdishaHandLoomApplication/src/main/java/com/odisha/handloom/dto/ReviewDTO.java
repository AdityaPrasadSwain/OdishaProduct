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
        private UUID orderItemId;
        private int rating;
        private String reviewText;
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
    }
}
