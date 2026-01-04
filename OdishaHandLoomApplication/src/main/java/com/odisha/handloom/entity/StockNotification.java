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

    @Column(nullable = false)
    @Builder.Default
    private Boolean notified = false;

    @CreationTimestamp
    private LocalDateTime requestedAt;

    public UUID getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public User getCustomer() {
        return customer;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public boolean isNotified() {
        return Boolean.TRUE.equals(notified);
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public void setNotified(Boolean notified) {
        this.notified = notified;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }
}
