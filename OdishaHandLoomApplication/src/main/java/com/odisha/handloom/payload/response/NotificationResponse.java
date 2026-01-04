package com.odisha.handloom.payload.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class NotificationResponse {
    private UUID id;
    private String message;
    private String type; // String to be safe for frontend
    private boolean isRead;
    private String senderName; // "System" if null
    private LocalDateTime createdAt;
    private UUID orderId;
    private UUID reelId;
    private UUID commentId;

    public NotificationResponse() {
    }

    public NotificationResponse(UUID id, String message, String type, boolean isRead, String senderName,
            LocalDateTime createdAt, UUID orderId, UUID reelId, UUID commentId) {
        this.id = id;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
        this.senderName = senderName;
        this.createdAt = createdAt;
        this.orderId = orderId;
        this.reelId = reelId;
        this.commentId = commentId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UUID getOrderId() {
        return orderId;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }

    public UUID getReelId() {
        return reelId;
    }

    public void setReelId(UUID reelId) {
        this.reelId = reelId;
    }

    public UUID getCommentId() {
        return commentId;
    }

    public void setCommentId(UUID commentId) {
        this.commentId = commentId;
    }
}
