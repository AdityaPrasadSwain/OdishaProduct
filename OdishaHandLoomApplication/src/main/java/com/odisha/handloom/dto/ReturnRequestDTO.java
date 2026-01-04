package com.odisha.handloom.dto;

import com.odisha.handloom.enums.ReturnReason;
import com.odisha.handloom.enums.ReturnStatus;
import com.odisha.handloom.enums.RequestType;
import com.odisha.handloom.enums.RefundMethod;
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
        private RequestType type;
        private RefundMethod refundMethod;
        private String refundDetails;
        private String pickupAddress;

        public void setOrderId(UUID orderId) {
            this.orderId = orderId;
        }

        public void setOrderItemId(UUID orderItemId) {
            this.orderItemId = orderItemId;
        }

        public void setReason(ReturnReason reason) {
            this.reason = reason;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public void setProofImageUrl(String proofImageUrl) {
            this.proofImageUrl = proofImageUrl;
        }

        public void setType(RequestType type) {
            this.type = type;
        }

        public void setRefundMethod(RefundMethod refundMethod) {
            this.refundMethod = refundMethod;
        }

        public void setRefundDetails(String refundDetails) {
            this.refundDetails = refundDetails;
        }

        public void setPickupAddress(String pickupAddress) {
            this.pickupAddress = pickupAddress;
        }

        public UUID getOrderId() {
            return orderId;
        }

        public UUID getOrderItemId() {
            return orderItemId;
        }

        public ReturnReason getReason() {
            return reason;
        }

        public String getDescription() {
            return description;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public String getProofImageUrl() {
            return proofImageUrl;
        }

        public RequestType getType() {
            return type;
        }

        public RefundMethod getRefundMethod() {
            return refundMethod;
        }

        public String getRefundDetails() {
            return refundDetails;
        }

        public String getPickupAddress() {
            return pickupAddress;
        }
    }

    @Data
    public static class CreateRequestMultipart {
        private UUID orderId;
        private UUID orderItemId;
        private ReturnReason reason;
        private String description;
        private org.springframework.web.multipart.MultipartFile image;
        private org.springframework.web.multipart.MultipartFile proofImage;
        private RequestType type;
        private RefundMethod refundMethod;
        private String refundDetails;
        private String pickupAddress;

        public org.springframework.web.multipart.MultipartFile getImage() {
            return image;
        }

        public org.springframework.web.multipart.MultipartFile getProofImage() {
            return proofImage;
        }

        public UUID getOrderId() {
            return orderId;
        }

        public UUID getOrderItemId() {
            return orderItemId;
        }

        public ReturnReason getReason() {
            return reason;
        }

        public String getDescription() {
            return description;
        }

        public RequestType getType() {
            return type;
        }

        public RefundMethod getRefundMethod() {
            return refundMethod;
        }

        public String getRefundDetails() {
            return refundDetails;
        }

        public String getPickupAddress() {
            return pickupAddress;
        }

        public void setOrderId(UUID orderId) {
            this.orderId = orderId;
        }

        public void setOrderItemId(UUID orderItemId) {
            this.orderItemId = orderItemId;
        }

        public void setReason(ReturnReason reason) {
            this.reason = reason;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public void setImage(org.springframework.web.multipart.MultipartFile image) {
            this.image = image;
        }

        public void setProofImage(org.springframework.web.multipart.MultipartFile proofImage) {
            this.proofImage = proofImage;
        }

        public void setType(RequestType type) {
            this.type = type;
        }

        public void setRefundMethod(RefundMethod refundMethod) {
            this.refundMethod = refundMethod;
        }

        public void setRefundDetails(String refundDetails) {
            this.refundDetails = refundDetails;
        }

        public void setPickupAddress(String pickupAddress) {
            this.pickupAddress = pickupAddress;
        }
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
        private RequestType type;
        private RefundMethod refundMethod;
        private String refundDetails;
        private String pickupAddress;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public void setId(UUID id) {
            this.id = id;
        }

        public void setOrderId(UUID orderId) {
            this.orderId = orderId;
        }

        public void setOrderItemId(UUID orderItemId) {
            this.orderItemId = orderItemId;
        }

        public void setCustomerId(UUID customerId) {
            this.customerId = customerId;
        }

        public void setCustomerName(String customerName) {
            this.customerName = customerName;
        }

        public void setSellerId(UUID sellerId) {
            this.sellerId = sellerId;
        }

        public void setSellerName(String sellerName) {
            this.sellerName = sellerName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public void setProductImage(String productImage) {
            this.productImage = productImage;
        }

        public void setReason(ReturnReason reason) {
            this.reason = reason;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public void setProofImageUrl(String proofImageUrl) {
            this.proofImageUrl = proofImageUrl;
        }

        public void setStatus(ReturnStatus status) {
            this.status = status;
        }

        public void setSellerRemarks(String sellerRemarks) {
            this.sellerRemarks = sellerRemarks;
        }

        public void setAdminComment(String adminComment) {
            this.adminComment = adminComment;
        }

        public void setType(RequestType type) {
            this.type = type;
        }

        public void setRefundMethod(RefundMethod refundMethod) {
            this.refundMethod = refundMethod;
        }

        public void setRefundDetails(String refundDetails) {
            this.refundDetails = refundDetails;
        }

        public void setPickupAddress(String pickupAddress) {
            this.pickupAddress = pickupAddress;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public void setUpdatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
        }

        public UUID getId() {
            return id;
        }

        public UUID getOrderId() {
            return orderId;
        }

        public UUID getOrderItemId() {
            return orderItemId;
        }

        public UUID getCustomerId() {
            return customerId;
        }

        public String getCustomerName() {
            return customerName;
        }

        public UUID getSellerId() {
            return sellerId;
        }

        public String getSellerName() {
            return sellerName;
        }

        public String getProductName() {
            return productName;
        }

        public String getProductImage() {
            return productImage;
        }

        public ReturnReason getReason() {
            return reason;
        }

        public String getDescription() {
            return description;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public String getProofImageUrl() {
            return proofImageUrl;
        }

        public ReturnStatus getStatus() {
            return status;
        }

        public String getSellerRemarks() {
            return sellerRemarks;
        }

        public String getAdminComment() {
            return adminComment;
        }

        public RequestType getType() {
            return type;
        }

        public RefundMethod getRefundMethod() {
            return refundMethod;
        }

        public String getRefundDetails() {
            return refundDetails;
        }

        public String getPickupAddress() {
            return pickupAddress;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public LocalDateTime getUpdatedAt() {
            return updatedAt;
        }
    }

    @Data
    public static class SellerDecision {
        private boolean approved; // true = APPROVED_BY_SELLER, false = REJECTED_BY_SELLER
        private String remarks;
        private ReturnStatus status; // Optional: specific status to set

        public boolean isApproved() {
            return approved;
        }

        public String getRemarks() {
            return remarks;
        }

        public ReturnStatus getStatus() {
            return status;
        }

        public void setApproved(boolean approved) {
            this.approved = approved;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public void setStatus(ReturnStatus status) {
            this.status = status;
        }
    }

    @Data
    public static class AdminDecision {
        private ReturnStatus status;
        private String comment;

        public ReturnStatus getStatus() {
            return status;
        }

        public String getComment() {
            return comment;
        }

        public void setStatus(ReturnStatus status) {
            this.status = status;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }
    }
}
