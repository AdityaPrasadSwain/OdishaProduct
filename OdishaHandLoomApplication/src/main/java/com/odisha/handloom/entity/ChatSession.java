package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id") // Nullable for Guests
    private UUID userId;

    @Column(name = "user_role", nullable = false)
    private String userRole; // CUSTOMER, SELLER, GUEST

    @Column(name = "is_active")
    private boolean active;

    // State Machine Fields
    @Column(name = "current_intent")
    private String currentIntent;

    @Column(name = "current_step_id")
    private String currentStepId;

    @Column(name = "selected_order_id")
    private UUID selectedOrderId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
