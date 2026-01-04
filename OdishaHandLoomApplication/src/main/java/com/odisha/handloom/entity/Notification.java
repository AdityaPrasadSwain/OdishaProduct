package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Recipient

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id") // Nullable
    private User sender;

    @Column(nullable = false, length = 500)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    // Order ID reference
    @Column(name = "order_id")
    private UUID orderId;

    @Column(name = "reel_id")
    private UUID reelId;

    @Column(name = "comment_id")
    private UUID commentId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum NotificationType {
        ORDER,
        FOLLOW,
        COMMENT,
        LIKE,
        REEL,
        PAYOUT,
        SYSTEM
    }

    public UUID getOrderId() {
        return orderId;
    }

    public UUID getReelId() {
        return reelId;
    }

    public UUID getCommentId() {
        return commentId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public User getSender() {
        return sender;
    }

    public NotificationType getType() {
        return type;
    }

    public boolean isRead() {
        return Boolean.TRUE.equals(isRead);
    }

    public void setRead(Boolean read) {
        isRead = read;
    }

    public UUID getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }

    public void setReelId(UUID reelId) {
        this.reelId = reelId;
    }

    public void setCommentId(UUID commentId) {
        this.commentId = commentId;
    }
}
