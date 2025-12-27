package com.odisha.handloom.dto;

import com.odisha.handloom.enums.ReturnReason;
import com.odisha.handloom.enums.ReturnStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReturnRequestDTO {

    @Data
    public static class CreateRequest {
        private UUID orderId;
        private UUID orderItemId;
        private ReturnReason reason;
        private String description;
        private String imageUrl;
        private String proofImageUrl;
    }

    @Data
    public static class Response {
        private UUID id;
        private UUID orderId;
        private UUID orderItemId;
        private UUID customerId;
        private String customerName;
        private UUID sellerId;
        private String sellerName;
        private String productName;
        private String productImage;
        private ReturnReason reason;
        private String description;
        private String imageUrl;
        private String proofImageUrl;
        private ReturnStatus status;
        private String sellerRemarks;
        private String adminComment;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    public static class SellerDecision {
        private boolean approved; // true = APPROVED_BY_SELLER, false = REJECTED_BY_SELLER
        private String remarks;
    }

    @Data
    public static class AdminDecision {
        private ReturnStatus status;
        private String comment;
    }
}
