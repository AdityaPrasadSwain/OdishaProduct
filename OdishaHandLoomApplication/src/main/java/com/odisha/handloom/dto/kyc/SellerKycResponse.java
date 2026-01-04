package com.odisha.handloom.dto.kyc;

import com.odisha.handloom.entity.KycStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@lombok.AllArgsConstructor
public class SellerKycResponse {
    private String status; // KycStatus string
    private boolean panVerified;
    private String panMasked;
    private boolean aadhaarVerified;
    private String aadhaarMasked;
    private boolean gstVerified;
    private String rejectionReason;

    public SellerKycResponse() {
    }

    public String getStatus() {
        return status;
    }

    public boolean isPanVerified() {
        return panVerified;
    }

    public String getPanMasked() {
        return panMasked;
    }

    public boolean isAadhaarVerified() {
        return aadhaarVerified;
    }

    public String getAadhaarMasked() {
        return aadhaarMasked;
    }

    public boolean isGstVerified() {
        return gstVerified;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setPanVerified(boolean panVerified) {
        this.panVerified = panVerified;
    }

    public void setPanMasked(String panMasked) {
        this.panMasked = panMasked;
    }

    public void setAadhaarVerified(boolean aadhaarVerified) {
        this.aadhaarVerified = aadhaarVerified;
    }

    public void setAadhaarMasked(String aadhaarMasked) {
        this.aadhaarMasked = aadhaarMasked;
    }

    public void setGstVerified(boolean gstVerified) {
        this.gstVerified = gstVerified;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
