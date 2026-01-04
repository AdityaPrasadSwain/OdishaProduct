package com.odisha.handloom.finance.entity;

import com.odisha.handloom.finance.enums.SettlementStatus;
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
@Table(name = "seller_settlements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerSettlement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_id", nullable = false)
    private UUID orderId;

    @Column(name = "seller_id", nullable = false)
    private UUID sellerId;

    @Column(name = "order_amount", nullable = false)
    private BigDecimal orderAmount;

    @Column(name = "platform_fee", nullable = false)
    private BigDecimal platformFee;

    @Column(name = "tax", nullable = false)
    private BigDecimal tax;

    @Column(name = "net_amount", nullable = false)
    private BigDecimal netAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SettlementStatus status;

    @Column(name = "transaction_ref")
    private String transactionRef;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;
}
