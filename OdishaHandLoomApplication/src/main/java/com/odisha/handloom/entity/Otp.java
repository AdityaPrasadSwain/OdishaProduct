package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "otps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Otp {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = true)
    private String email;

    @Column(nullable = true)
    private String mobile;

    @Column(nullable = true)
    private String type; // EMAIL or MOBILE

    @Column(nullable = false, length = 6)
    private String otp;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @Column(nullable = false)
    @Builder.Default
    private boolean used = false;

    @Column(nullable = false)
    @Builder.Default
    private int attemptCount = 0;

    @Column(nullable = false)
    private LocalDateTime lastSentAt;

    @Column(nullable = true)
    private LocalDateTime resendAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now(java.time.ZoneId.systemDefault());
        }
        // Ensure used is false by default if not set
        if (!this.used) {
            this.used = false;
        }
        // Ensure attemptCount is 0
        if (this.attemptCount < 0) {
            this.attemptCount = 0;
        }
    }
}
