package com.odisha.handloom.payload.dto;

import lombok.Data;

@Data
public class UserProfileUpdateDto {
    private String fullName;
    private String phoneNumber;
    private String address;
    private String bio;
    private String gender;
}
