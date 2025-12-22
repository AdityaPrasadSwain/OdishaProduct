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
    @Column(name = "pan_verified")
    private boolean panVerified = false;

    // Aadhaar Details
    @Column(name = "aadhaar_masked")
    private String aadhaarMasked; // Format: XXXX-XXXX-1234

    @Builder.Default
    @Column(name = "aadhaar_verified")
    private boolean aadhaarVerified = false;

    // GST Details
    @Column(name = "gstin")
    private String gstin;

    @Builder.Default
    @Column(name = "gst_verified")
    private boolean gstVerified = false;

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
}
