package com.odisha.handloom.enums;

public enum ReturnStatus {
    PENDING,
    APPROVED,
    REJECTED,
    PICKUP_SCHEDULED,
    REFUND_INITIATED,
    COMPLETED;

    @com.fasterxml.jackson.annotation.JsonCreator
    public static ReturnStatus from(String value) {
        if (value == null)
            return null;
        value = value.trim().toUpperCase();

        return switch (value) {
            case "APPROVED_BY_ADMIN" -> APPROVED;
            case "REFUND_DONE", "REFUND_COMPLETED" -> COMPLETED;
            default -> ReturnStatus.valueOf(value);
        };
    }
}
