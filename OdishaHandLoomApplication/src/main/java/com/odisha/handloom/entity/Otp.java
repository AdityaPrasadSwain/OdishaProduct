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

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    @Column(nullable = false)
    @Builder.Default
    private Boolean used = false;

    @Column(nullable = false)
    @Builder.Default
    private Integer attemptCount = 0;

    @Column(nullable = false)
    private LocalDateTime lastSentAt;

    @Column(nullable = true)
    private LocalDateTime resendAt;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isUsed() {
        return Boolean.TRUE.equals(used);
    }

    public void setUsed(Boolean used) {
        this.used = used;
    }

    public Integer getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }

    public LocalDateTime getLastSentAt() {
        return lastSentAt;
    }

    public void setLastSentAt(LocalDateTime lastSentAt) {
        this.lastSentAt = lastSentAt;
    }

    public LocalDateTime getResendAt() {
        return resendAt;
    }

    public void setResendAt(LocalDateTime resendAt) {
        this.resendAt = resendAt;
    }

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now(java.time.ZoneId.systemDefault());
        }
        // Ensure used is false by default if not set
        if (this.used == null) {
            this.used = false;
        }
        // Ensure attemptCount is 0
        if (this.attemptCount == null || this.attemptCount < 0) {
            this.attemptCount = 0;
        }
    }
}
