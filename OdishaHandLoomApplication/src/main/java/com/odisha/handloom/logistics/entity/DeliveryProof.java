package com.odisha.handloom.logistics.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "delivery_proofs")
@Data
public class DeliveryProof {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_id", nullable = false)
    private UUID orderId;

    @Column(name = "shipment_id", nullable = false)
    private UUID shipmentId;

    @Column(name = "agent_id", nullable = false)
    private UUID agentId;

    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "verified", nullable = false)
    private Boolean verified = false;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    public boolean isVerified() {
        return Boolean.TRUE.equals(verified);
    }

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;
}
