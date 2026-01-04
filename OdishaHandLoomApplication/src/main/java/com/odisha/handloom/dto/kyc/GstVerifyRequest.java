package com.odisha.handloom.dto.kyc;

import lombok.Data;

@Data
public class GstVerifyRequest {
    private String gstNumber;
    private String businessName; // Optional validation

    public String getGstNumber() {
        return gstNumber;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }
}
