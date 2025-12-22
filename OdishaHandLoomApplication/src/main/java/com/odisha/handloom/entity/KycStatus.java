package com.odisha.handloom.entity;

public enum KycStatus {
    NOT_STARTED,
    PAN_VERIFIED,
    AADHAAR_VERIFIED, // OTP Verified
    GST_VERIFIED, // Optional step
    PENDING_APPROVAL, // All steps done, waiting for Admin
    APPROVED,
    REJECTED
}
