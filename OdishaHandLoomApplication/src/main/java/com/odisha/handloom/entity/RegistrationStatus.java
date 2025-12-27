package com.odisha.handloom.entity;

public enum RegistrationStatus {
    PENDING_DOCS,
    PENDING_BANK,
    PENDING_VERIFICATION, // This is what I added
    COMPLETED,
    APPROVED,
    REJECTED,
    SUSPENDED,
    DOCUMENTS_REJECTED,
    BANK_REJECTED,
    BLOCKED
}
