package com.odisha.handloom.dto.kyc;

import lombok.Data;

@Data
public class GstVerifyRequest {
    private String gstNumber;
    private String businessName; // Optional validation
}
