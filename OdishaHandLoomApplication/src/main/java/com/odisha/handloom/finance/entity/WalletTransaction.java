package com.odisha.handloom.finance.entity;

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
@Table(name = "wallet_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    private PlatformWallet wallet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type; // CREDIT, DEBIT

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionSource source; // ORDER_PAYMENT, SELLER_PAYOUT, AGENT_PAYOUT, REFUND

    private String referenceId; // Order ID, Settlement ID, or Payout ID

    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum TransactionType {
        CREDIT, DEBIT
    }

    public enum TransactionSource {
        ORDER_PAYMENT,
        SELLER_PAYOUT,
        AGENT_PAYOUT,
        REFUND,
        ADJUSTMENT
    }
}
