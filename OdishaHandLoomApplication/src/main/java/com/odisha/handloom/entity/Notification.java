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
    private boolean isRead = false;

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
        REEL,
        PAYOUT,
        SYSTEM
    }
}
