package com.odisha.handloom.logistics.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "shipment_failures")
@Data
public class ShipmentFailure {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "shipment_id", nullable = false)
    private UUID shipmentId;

    @Column(name = "agent_id", nullable = false)
    private UUID agentId;

    @Column(nullable = false)
    private String reason;

    @CreationTimestamp
    @Column(name = "attempted_at", updatable = false)
    private LocalDateTime attemptedAt;

    public UUID getId() {
        return id;
    }

    public UUID getShipmentId() {
        return shipmentId;
    }

    public UUID getAgentId() {
        return agentId;
    }

    public String getReason() {
        return reason;
    }

    public LocalDateTime getAttemptedAt() {
        return attemptedAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setShipmentId(UUID shipmentId) {
        this.shipmentId = shipmentId;
    }

    public void setAgentId(UUID agentId) {
        this.agentId = agentId;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setAttemptedAt(LocalDateTime attemptedAt) {
        this.attemptedAt = attemptedAt;
    }
}
