package com.odisha.handloom.dto.kyc;

import lombok.Data;

@Data
public class AadhaarVerifyRequest {
    private String otp;
    private String aadhaarNumber; // To re-verify format/masking context if needed

    public String getOtp() {
        return otp;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }
}
