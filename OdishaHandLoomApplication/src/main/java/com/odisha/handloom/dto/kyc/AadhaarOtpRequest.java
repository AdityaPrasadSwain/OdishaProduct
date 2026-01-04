package com.odisha.handloom.dto.kyc;

import lombok.Data;

@Data
public class AadhaarOtpRequest {
    private String aadhaarNumber; // 12 digit

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }
}
