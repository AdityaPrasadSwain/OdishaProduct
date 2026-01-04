package com.odisha.handloom.logistics.dto;

import lombok.Data;

@Data
public class FailureRequest {
    private String reason;

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
