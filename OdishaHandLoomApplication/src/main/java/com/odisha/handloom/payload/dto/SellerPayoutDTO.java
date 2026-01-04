package com.odisha.handloom.payload.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class SellerPayoutDTO {
    private UUID id;
    private String fullName;
    private String shopName;
    private BankDetailsDTO bankDetails;

    @Data
    public static class BankDetailsDTO {
        private String accountNumber;
        private String ifscCode;
        private String accountHolderName;
        private String bankName;
        private Boolean verified;

        // Constructor for easy mapping
        public BankDetailsDTO(String accountNumber, String ifscCode, String accountHolderName, String bankName,
                Boolean verified) {
            this.accountNumber = accountNumber;
            this.ifscCode = ifscCode;
            this.accountHolderName = accountHolderName;
            this.bankName = bankName;
            this.verified = verified;
        }
    }
}
