package com.odisha.handloom.logistics.entity;

import com.odisha.handloom.enums.ProofRequestStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "seller_proof_requests", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "seller_id", "shipment_id" })
})
@Data
public class SellerProofRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "seller_id", nullable = false)
    private UUID sellerId;

    @Column(name = "shipment_id", nullable = false)
    private UUID shipmentId;

    @Column(name = "order_id")
    private UUID orderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProofRequestStatus status = ProofRequestStatus.PENDING;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "admin_comment", columnDefinition = "TEXT")
    private String adminComment;

    @CreationTimestamp
    @Column(name = "requested_at", updatable = false)
    private LocalDateTime requestedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;
}
