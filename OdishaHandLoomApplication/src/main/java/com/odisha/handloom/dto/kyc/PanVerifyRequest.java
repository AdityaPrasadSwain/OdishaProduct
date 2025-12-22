package com.odisha.handloom.dto.kyc;

import lombok.Data;

@Data
public class PanVerifyRequest {
    private String panNumber;
    private String fullName; // Must match PAN records
    private String dob; // YYYY-MM-DD
}
