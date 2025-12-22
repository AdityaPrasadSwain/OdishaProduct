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
@Table(name = "seller_earnings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerEarnings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @OneToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @Column(nullable = false)
    private BigDecimal grossAmount; // Product Price * Quantity

    @Column(nullable = false)
    private BigDecimal commission; // Platform fee

    @Column(nullable = false)
    private BigDecimal gstAmount; // GST on commission

    @Column(nullable = false)
    private BigDecimal netAmount; // gross - commission - gst

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayoutStatus payoutStatus;

    @ManyToOne
    @JoinColumn(name = "payout_id")
    private Payout payout; // Link to payout when paid

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum PayoutStatus {
        PENDING,
        PAID,
        FAILED
    }
}
