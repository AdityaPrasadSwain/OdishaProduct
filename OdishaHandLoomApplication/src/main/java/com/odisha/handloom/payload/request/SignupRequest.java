package com.odisha.handloom.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignupRequest {
    @NotBlank(message = "Full Name is required.")
    @Size(min = 3, message = "Full Name must be at least 3 characters long.")
    @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-Z\\s]*$", message = "Full Name can contain only letters and spaces.")
    private String fullName;

    @NotBlank(message = "Email address is required.")
    @Email(message = "Please enter a valid email address.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    private String password;

    @NotBlank(message = "Phone number is required.")
    @jakarta.validation.constraints.Pattern(regexp = "^\\d{10}$", message = "Please enter a valid 10-digit mobile number.")
    private String phoneNumber;

    // For Seller
    private String shopName;

    private String gstNumber;

    @NotBlank(message = "Please select an account type.")
    @jakarta.validation.constraints.Pattern(regexp = "^(?i)(customer|seller|admin)$", message = "Invalid account type selected.")
    private String role; // "admin", "seller", "customer"

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getGstNumber() {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
