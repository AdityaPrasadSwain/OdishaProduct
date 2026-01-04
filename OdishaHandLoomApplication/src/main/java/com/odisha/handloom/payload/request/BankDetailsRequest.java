package com.odisha.handloom.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BankDetailsRequest {
    @NotBlank(message = "Account Holder Name is required")
    private String accountHolderName;

    @NotBlank(message = "Bank Name is required")
    private String bankName;

    @NotBlank(message = "Account Number is required")
    private String accountNumber;

    @NotBlank(message = "IFSC Code is required")
    private String ifscCode;

    private String branch;

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public String getBankName() {
        return bankName;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public String getBranch() {
        return branch;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }
}
