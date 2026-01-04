package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "seller_kyc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerKyc {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // PAN Details
    @Column(name = "pan_masked")
    private String panMasked; // Format: ABCDE****F

    @Builder.Default
    @Column(name = "pan_verified", nullable = false)
    private Boolean panVerified = false;

    // Aadhaar Details
    @Column(name = "aadhaar_masked")
    private String aadhaarMasked; // Format: XXXX-XXXX-1234

    @Builder.Default
    @Column(name = "aadhaar_verified", nullable = false)
    private Boolean aadhaarVerified = false;

    // GST Details
    @Column(name = "gstin")
    private String gstin;

    @Builder.Default
    @Column(name = "gst_verified", nullable = false)
    private Boolean gstVerified = false;

    // Request ID for Aadhaar OTP (Transient usually, but storing for session
    // validity if needed,
    // strictly implementation detail, keeping out for now to ensure we don't store
    // sensitive data).

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "kyc_status", nullable = false)
    private KycStatus kycStatus = KycStatus.NOT_STARTED;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getPanMasked() {
        return panMasked;
    }

    public boolean isPanVerified() {
        return Boolean.TRUE.equals(panVerified);
    }

    public String getAadhaarMasked() {
        return aadhaarMasked;
    }

    public boolean isAadhaarVerified() {
        return Boolean.TRUE.equals(aadhaarVerified);
    }

    public String getGstin() {
        return gstin;
    }

    public boolean isGstVerified() {
        return Boolean.TRUE.equals(gstVerified);
    }

    public KycStatus getKycStatus() {
        return kycStatus;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setPanMasked(String panMasked) {
        this.panMasked = panMasked;
    }

    public void setPanVerified(Boolean panVerified) {
        this.panVerified = panVerified;
    }

    public void setAadhaarMasked(String aadhaarMasked) {
        this.aadhaarMasked = aadhaarMasked;
    }

    public void setAadhaarVerified(Boolean aadhaarVerified) {
        this.aadhaarVerified = aadhaarVerified;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public void setGstVerified(Boolean gstVerified) {
        this.gstVerified = gstVerified;
    }

    public void setKycStatus(KycStatus kycStatus) {
        this.kycStatus = kycStatus;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
