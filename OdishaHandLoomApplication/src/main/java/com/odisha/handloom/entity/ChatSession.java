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

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true; // Default to true if not specified

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public boolean isActive() {
        return Boolean.TRUE.equals(isActive);
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public String getCurrentIntent() {
        return currentIntent;
    }

    public void setCurrentIntent(String currentIntent) {
        this.currentIntent = currentIntent;
    }

    public String getCurrentStepId() {
        return currentStepId;
    }

    public void setCurrentStepId(String currentStepId) {
        this.currentStepId = currentStepId;
    }

    public UUID getSelectedOrderId() {
        return selectedOrderId;
    }

    public void setSelectedOrderId(UUID selectedOrderId) {
        this.selectedOrderId = selectedOrderId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

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
