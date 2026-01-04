package com.odisha.handloom.dto.kyc;

import lombok.Data;

@Data
public class PanVerifyRequest {
    private String panNumber;
    private String fullName; // Must match PAN records
    private String dob; // YYYY-MM-DD

    public String getPanNumber() {
        return panNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public String getDob() {
        return dob;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }
}
