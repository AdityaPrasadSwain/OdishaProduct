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

    public UUID getId() {
        return id;
    }

    public User getSeller() {
        return seller;
    }

    public Order getOrder() {
        return order;
    }

    public OrderItem getOrderItem() {
        return orderItem;
    }

    public BigDecimal getGrossAmount() {
        return grossAmount;
    }

    public BigDecimal getCommission() {
        return commission;
    }

    public BigDecimal getGstAmount() {
        return gstAmount;
    }

    public BigDecimal getNetAmount() {
        return netAmount;
    }

    public PayoutStatus getPayoutStatus() {
        return payoutStatus;
    }

    public Payout getPayout() {
        return payout;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    public void setGrossAmount(BigDecimal grossAmount) {
        this.grossAmount = grossAmount;
    }

    public void setCommission(BigDecimal commission) {
        this.commission = commission;
    }

    public void setGstAmount(BigDecimal gstAmount) {
        this.gstAmount = gstAmount;
    }

    public void setNetAmount(BigDecimal netAmount) {
        this.netAmount = netAmount;
    }

    public void setPayoutStatus(PayoutStatus payoutStatus) {
        this.payoutStatus = payoutStatus;
    }

    public void setPayout(Payout payout) {
        this.payout = payout;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
