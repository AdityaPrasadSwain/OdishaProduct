package com.odisha.handloom.dto.kyc;

import lombok.Data;

@Data
public class AadhaarVerifyRequest {
    private String otp;
    private String aadhaarNumber; // To re-verify format/masking context if needed
}
