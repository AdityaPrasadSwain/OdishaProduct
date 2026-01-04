package com.odisha.handloom.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
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

    // Profile Fields
    private String profilePictureUrl;
    private String bio;
    private String gender;

    // Seller fields
    private String gstNumber;
    private String shopName;
    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved = false; // For Admin to approve seller
    private Boolean isBlocked; // For Admin to block/unblock seller

    private String panNumber;
    private String bankAccountNumber;
    private String ifscCode;
    private String bankName;
    private String accountHolderName;

    @Column(name = "is_bank_verified", nullable = false)
    private Boolean isBankVerified = false;

    private Long followersCount = 0L;
    private Long followingCount = 0L;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    public boolean isDeleted() {
        return Boolean.TRUE.equals(isDeleted);
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private java.util.List<Address> addresses;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus registrationStatus;

    public RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
    }

    // New Business Details
    private String businessType;
    private String state;
    private String city;
    private String pincode;

    public User() {
    }

    public User(String username, String email, String password) {
        this.email = email;
        this.password = password;
        this.fullName = username; // Default fallback if needed, or just set separately
    }

    public User(UUID id, String email, String password, String fullName, String phoneNumber, Role role, String address,
            String profilePictureUrl, String bio, String gender,
            String gstNumber, String shopName, Boolean isApproved, Boolean isBlocked, String panNumber,
            String bankAccountNumber,
            String ifscCode, String bankName, String accountHolderName, LocalDateTime createdAt,
            LocalDateTime updatedAt,
            RegistrationStatus registrationStatus,
            String businessType, String state, String city, String pincode) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.address = address;
        this.profilePictureUrl = profilePictureUrl;
        this.bio = bio;
        this.gender = gender;
        this.gstNumber = gstNumber;
        this.shopName = shopName;
        this.isApproved = isApproved;
        this.isBlocked = isBlocked;
        this.panNumber = panNumber;
        this.bankAccountNumber = bankAccountNumber;
        this.ifscCode = ifscCode;
        this.bankName = bankName;
        this.accountHolderName = accountHolderName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.registrationStatus = registrationStatus;

        this.businessType = businessType;
        this.state = state;
        this.city = city;
        this.pincode = pincode;
    }

    // ... Standard Getters and Setters for new fields ...
    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    // ... Existing Getters and Setters ...
    // (Ensure I didn't break existing ones)
    // I will replace only from Constructor start down to Builder to allow inserting
    // new ones safely.
    // Wait, the replace tool requires exact match.
    // I'll append fields after `RegistrationStatus` property and add
    // getters/setters before Builder.
    // Then update Builder.

    // Actually, to be safe with smaller chunks:
    // 1. Add fields.
    // 2. Add Getters/Setters.
    // 3. Update Builder/Constructor if heavily used, or just let JPA use default
    // constructor + setters.
    // The Builder is used in UserDetailsServiceImpl probably. Ideally I update it.

    // Let's do a large replace of the class body parts.

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

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
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
        return Boolean.TRUE.equals(isApproved);
    }

    public void setApproved(Boolean approved) {
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

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }

    public boolean isBankVerified() {
        return Boolean.TRUE.equals(isBankVerified);
    }

    public void setBankVerified(Boolean bankVerified) {
        isBankVerified = bankVerified;
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

    public Long getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(Long followersCount) {
        this.followersCount = followersCount;
    }

    public Long getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(Long followingCount) {
        this.followingCount = followingCount;
    }

    public static class UserBuilder {
        private UUID id;
        private String email;
        private String password;
        private String fullName;
        private String phoneNumber;
        private Role role;
        private String address;
        private String profilePictureUrl;
        private String bio;
        private String gender;
        private String gstNumber;
        private String shopName;
        private Boolean isApproved;
        private Boolean isBlocked;
        private String panNumber;
        private String bankAccountNumber;
        private String ifscCode;
        private String bankName;
        private String accountHolderName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private RegistrationStatus registrationStatus;

        private String businessType;
        private String state;
        private String city;
        private String pincode;
        private Long followersCount = 0L;
        private Long followingCount = 0L;
        private Boolean isBankVerified = false;
        private Boolean isDeleted = false;

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

        public UserBuilder profilePictureUrl(String profilePictureUrl) {
            this.profilePictureUrl = profilePictureUrl;
            return this;
        }

        public UserBuilder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public UserBuilder gender(String gender) {
            this.gender = gender;
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

        public UserBuilder isApproved(Boolean isApproved) {
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

        public UserBuilder accountHolderName(String accountHolderName) {
            this.accountHolderName = accountHolderName;
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

        public UserBuilder registrationStatus(RegistrationStatus registrationStatus) {
            this.registrationStatus = registrationStatus;
            return this;
        }

        public UserBuilder businessType(String businessType) {
            this.businessType = businessType;
            return this;
        }

        public UserBuilder state(String state) {
            this.state = state;
            return this;
        }

        public UserBuilder city(String city) {
            this.city = city;
            return this;
        }

        public UserBuilder pincode(String pincode) {
            this.pincode = pincode;
            return this;
        }

        public UserBuilder followersCount(Long followersCount) {
            this.followersCount = followersCount;
            return this;
        }

        public UserBuilder followingCount(Long followingCount) {
            this.followingCount = followingCount;
            return this;
        }

        public UserBuilder isBankVerified(Boolean isBankVerified) {
            this.isBankVerified = isBankVerified;
            return this;
        }

        public UserBuilder isDeleted(Boolean isDeleted) {
            this.isDeleted = isDeleted;
            return this;
        }

        public User build() {
            User user = new User(id, email, password, fullName, phoneNumber, role, address, profilePictureUrl, bio,
                    gender,
                    gstNumber, shopName, isApproved,
                    isBlocked, panNumber, bankAccountNumber, ifscCode, bankName, accountHolderName, createdAt,
                    updatedAt,
                    registrationStatus, businessType, state, city, pincode);
            user.setFollowersCount(followersCount);
            user.setFollowingCount(followingCount);
            user.setBankVerified(isBankVerified);
            user.setDeleted(isDeleted);
            return user;
        }
    }
}
