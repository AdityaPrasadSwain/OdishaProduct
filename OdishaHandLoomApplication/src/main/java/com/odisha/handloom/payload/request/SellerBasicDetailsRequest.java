package com.odisha.handloom.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SellerBasicDetailsRequest {
    @NotBlank
    private String fullName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 10, max = 15)
    private String phone;

    @NotBlank
    @Size(min = 6)
    private String password;

    @NotBlank
    private String businessName; // Maps to shopName
}
