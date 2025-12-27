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
}
