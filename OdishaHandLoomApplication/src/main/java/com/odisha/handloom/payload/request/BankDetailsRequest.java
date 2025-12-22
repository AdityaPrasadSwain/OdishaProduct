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
}
