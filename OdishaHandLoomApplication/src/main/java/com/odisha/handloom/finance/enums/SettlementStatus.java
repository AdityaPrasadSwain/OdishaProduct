package com.odisha.handloom.finance.enums;

public enum SettlementStatus {
    PENDING, // Order paid, not delivered
    READY, // Delivered, ready for payout
    PAID, // Payout approved/sent
    HOLD, // Blocked (RTO/Dispute)
    CANCELLED // Order cancelled
}
