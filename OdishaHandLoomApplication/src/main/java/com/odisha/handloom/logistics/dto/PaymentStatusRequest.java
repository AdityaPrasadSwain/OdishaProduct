package com.odisha.handloom.logistics.dto;

import lombok.Data;

@Data
public class PaymentStatusRequest {
    private String transactionRef;
    private String status; // SUCCESS, FAILED

    public String getTransactionRef() {
        return transactionRef;
    }

    public String getStatus() {
        return status;
    }

    public void setTransactionRef(String transactionRef) {
        this.transactionRef = transactionRef;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
