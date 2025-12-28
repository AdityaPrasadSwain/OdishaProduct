package com.odisha.handloom.enums;

public enum PaymentStatus {
    PENDING, // Created, not yet initiated
    INITIATED, // Redirected to gateway / UPI request sent
    AWAITING_CONFIRMATION, // Gateway processing
    SUCCESS, // Captured/Settled
    FAILED, // Gateway failed / Error
    REFUNDED, // Full refund
    CANCELLED, // User cancelled
    COD_PENDING_DELIVERY, // COD order placed
    COD_DELIVERED // COD payment collected
}
