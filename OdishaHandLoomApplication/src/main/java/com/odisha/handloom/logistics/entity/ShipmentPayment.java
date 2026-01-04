package com.odisha.handloom.logistics.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "shipment_payments")
@Data
public class ShipmentPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "shipment_id", nullable = false)
    private UUID shipmentId;

    @Column(name = "agent_id", nullable = false)
    private UUID agentId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_mode", nullable = false)
    private String paymentMode = "UPI_QR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(name = "transaction_ref")
    private String transactionRef;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum PaymentStatus {
        PENDING, SUCCESS, FAILED, REFUNDED
    }

    public UUID getId() {
        return id;
    }

    public UUID getShipmentId() {
        return shipmentId;
    }

    public UUID getAgentId() {
        return agentId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public String getTransactionRef() {
        return transactionRef;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
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

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public void setTransactionRef(String transactionRef) {
        this.transactionRef = transactionRef;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
