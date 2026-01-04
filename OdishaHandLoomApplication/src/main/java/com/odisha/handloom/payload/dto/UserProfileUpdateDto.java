package com.odisha.handloom.payload.dto;

import lombok.Data;

@Data
public class UserProfileUpdateDto {
    private String fullName;
    private String phoneNumber;
    private String address;
    private String bio;
    private String gender;

    public String getFullName() {
        return fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public String getBio() {
        return bio;
    }

    public String getGender() {
        return gender;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
