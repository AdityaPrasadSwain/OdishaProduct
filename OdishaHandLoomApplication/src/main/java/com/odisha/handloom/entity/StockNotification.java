package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "stock_notifications", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "product_id", "customer_email" })
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = true)
    private User customer;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    private boolean notified;

    @CreationTimestamp
    private LocalDateTime requestedAt;
}
