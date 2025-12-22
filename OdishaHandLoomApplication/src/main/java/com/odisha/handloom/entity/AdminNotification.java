package com.odisha.handloom.entity;

import com.odisha.handloom.enums.AdminNotificationPriority;
import com.odisha.handloom.enums.AdminNotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "admin_notifications", indexes = {
        @Index(name = "idx_an_read_created", columnList = "is_read, created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AdminNotificationType type;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "entity_id")
    private UUID entityId; // ID of the related Seller, Order, or ReturnRequest

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean isRead = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AdminNotificationPriority priority;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
