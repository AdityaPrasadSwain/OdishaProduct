package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payout {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(nullable = false)
    private String bankAccountSnapshot; // JSON or String dump of bank details at time of payout

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(unique = true)
    private String payoutReference; // e.g., Transaction ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayoutStatus status;

    @CreationTimestamp
    private LocalDateTime processedAt;

    public enum PayoutStatus {
        INITIATED,
        SUCCESS,
        FAILED
    }

    public UUID getId() {
        return id;
    }

    public User getSeller() {
        return seller;
    }

    public String getBankAccountSnapshot() {
        return bankAccountSnapshot;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getPayoutReference() {
        return payoutReference;
    }

    public PayoutStatus getStatus() {
        return status;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public void setBankAccountSnapshot(String bankAccountSnapshot) {
        this.bankAccountSnapshot = bankAccountSnapshot;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setPayoutReference(String payoutReference) {
        this.payoutReference = payoutReference;
    }

    public void setStatus(PayoutStatus status) {
        this.status = status;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
}
