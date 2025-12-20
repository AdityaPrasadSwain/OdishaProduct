package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "return_requests_v2")
@Data
public class ReturnRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @Column(nullable = false)
    private String reason; // "Damaged", "Wrong Item", "Size Issue", etc.

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "return_type") // Changed name to avoid keyword reserved conflict if any, but also good
                                  // practice. Actually kept 'type' in code but let's check. Original was 'type'.
                                  // I will keep it but remove nullable.
    private ReturnType type; // REFUND or REPLACEMENT

    @Enumerated(EnumType.STRING)
    @Column(name = "return_status") // Renaming status to return_status just in case, but MAINLY removing
                                    // nullable=false.
    private ReturnStatus status; // PENDING, APPROVED, REJECTED, PICKED_UP, COMPLETED

    private String proofImageUrl;

    private String sellerRemarks;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum ReturnType {
        REFUND, REPLACEMENT
    }

    public enum ReturnStatus {
        PENDING, APPROVED, REJECTED, PICKED_UP, COMPLETED
    }

    public ReturnRequest() {
    }

    public ReturnRequest(UUID id, OrderItem orderItem, User customer, User seller, String reason, String description,
            ReturnType type, ReturnStatus status, String proofImageUrl, String sellerRemarks, LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.orderItem = orderItem;
        this.customer = customer;
        this.seller = seller;
        this.reason = reason;
        this.description = description;
        this.type = type;
        this.status = status;
        this.proofImageUrl = proofImageUrl;
        this.sellerRemarks = sellerRemarks;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
