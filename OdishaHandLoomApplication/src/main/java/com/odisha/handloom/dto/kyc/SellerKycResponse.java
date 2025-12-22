package com.odisha.handloom.dto.kyc;

import com.odisha.handloom.entity.KycStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SellerKycResponse {
    private String status; // KycStatus string
    private boolean panVerified;
    private String panMasked;
    private boolean aadhaarVerified;
    private String aadhaarMasked;
    private boolean gstVerified;
    private String rejectionReason;
}
