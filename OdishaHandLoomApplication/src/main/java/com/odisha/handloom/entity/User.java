package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

    private String fullName;
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String address; // Simple address for now, can be an entity later

    // Seller fields
    private String gstNumber;
    private String shopName;
    private boolean isApproved; // For Admin to approve seller
    private Boolean isBlocked; // For Admin to block/unblock seller

    private String panNumber;
    private String bankAccountNumber;
    private String ifscCode;
    private String bankName;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Address> addresses;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public User() {
    }

    public User(UUID id, String email, String password, String fullName, String phoneNumber, Role role, String address,
            String gstNumber, String shopName, boolean isApproved, Boolean isBlocked, String panNumber,
            String bankAccountNumber,
            String ifscCode, String bankName, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.address = address;
        this.gstNumber = gstNumber;
        this.shopName = shopName;
        this.isApproved = isApproved;
        this.isBlocked = isBlocked;
        this.panNumber = panNumber;
        this.bankAccountNumber = bankAccountNumber;
        this.ifscCode = ifscCode;
        this.bankName = bankName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGstNumber() {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public boolean isApproved() {
        return isApproved;
    }

    public void setApproved(boolean approved) {
        isApproved = approved;
    }

    public boolean isBlocked() {
        return isBlocked != null && isBlocked;
    }

    public void setBlocked(Boolean blocked) {
        isBlocked = blocked;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Builder inner class (same as existing UserBuilder)
    public static class UserBuilder {
        private UUID id;
        private String email;
        private String password;
        private String fullName;
        private String phoneNumber;
        private Role role;
        private String address;
        private String gstNumber;
        private String shopName;
        private boolean isApproved;
        private Boolean isBlocked;
        private String panNumber;
        private String bankAccountNumber;
        private String ifscCode;
        private String bankName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        UserBuilder() {
        }

        public UserBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public UserBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public UserBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public UserBuilder address(String address) {
            this.address = address;
            return this;
        }

        public UserBuilder gstNumber(String gstNumber) {
            this.gstNumber = gstNumber;
            return this;
        }

        public UserBuilder shopName(String shopName) {
            this.shopName = shopName;
            return this;
        }

        public UserBuilder isApproved(boolean isApproved) {
            this.isApproved = isApproved;
            return this;
        }

        public UserBuilder isBlocked(Boolean isBlocked) {
            this.isBlocked = isBlocked;
            return this;
        }

        public UserBuilder panNumber(String panNumber) {
            this.panNumber = panNumber;
            return this;
        }

        public UserBuilder bankAccountNumber(String bankAccountNumber) {
            this.bankAccountNumber = bankAccountNumber;
            return this;
        }

        public UserBuilder ifscCode(String ifscCode) {
            this.ifscCode = ifscCode;
            return this;
        }

        public UserBuilder bankName(String bankName) {
            this.bankName = bankName;
            return this;
        }

        public UserBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public User build() {
            return new User(id, email, password, fullName, phoneNumber, role, address, gstNumber, shopName, isApproved,
                    isBlocked,
                    panNumber, bankAccountNumber, ifscCode, bankName, createdAt, updatedAt);
        }
    }
}
