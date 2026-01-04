package com.odisha.handloom.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SellerBankDetailsRequest {
    @NotBlank
    private String accountHolderName;

    @NotBlank
    private String accountNumber;

    @NotBlank
    private String ifscCode;

    @NotBlank
    private String bankName;

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public String getBankName() {
        return bankName;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }
}
