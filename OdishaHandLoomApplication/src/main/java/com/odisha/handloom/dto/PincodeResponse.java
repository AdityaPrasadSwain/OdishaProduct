package com.odisha.handloom.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PincodeResponse {
    private boolean valid;
    private String pincode;
    private String district;
    private String state;
    private String city;
    private String country;

    // Error message or status description if needed
    private String message;

    public static PincodeResponse invalid(String pincode) {
        return PincodeResponse.builder()
                .valid(false)
                .pincode(pincode)
                .message("Invalid PIN Code")
                .build();
    }
}
