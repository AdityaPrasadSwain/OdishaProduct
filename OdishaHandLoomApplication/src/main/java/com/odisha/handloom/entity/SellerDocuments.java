package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "seller_documents")
@Data
public class SellerDocuments {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User seller;

    private String panNumber;
    private String aadhaarNumber;
    private String gstNumber;

    private String panFileUrl;
    private String aadhaarFileUrl;
    private String gstFileUrl;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;
    private LocalDateTime verifiedAt;

    public SellerDocuments() {
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getGstNumber() {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }

    public String getPanFileUrl() {
        return panFileUrl;
    }

    public void setPanFileUrl(String panFileUrl) {
        this.panFileUrl = panFileUrl;
    }

    public String getAadhaarFileUrl() {
        return aadhaarFileUrl;
    }

    public void setAadhaarFileUrl(String aadhaarFileUrl) {
        this.aadhaarFileUrl = aadhaarFileUrl;
    }

    public String getGstFileUrl() {
        return gstFileUrl;
    }

    public void setGstFileUrl(String gstFileUrl) {
        this.gstFileUrl = gstFileUrl;
    }

    public boolean isVerified() {
        return Boolean.TRUE.equals(isVerified);
    }

    public void setVerified(Boolean verified) {
        isVerified = verified;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}
