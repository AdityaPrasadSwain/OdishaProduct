package com.odisha.handloom.logistics.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "delivery_otps")
@Data
public class DeliveryOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @Column(name = "otp_code", nullable = false)
    private String otpCode; // Hashed

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @Column(name = "verified", nullable = false)
    private Boolean verified = false;

    public boolean isVerified() {
        return Boolean.TRUE.equals(verified);
    }

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
