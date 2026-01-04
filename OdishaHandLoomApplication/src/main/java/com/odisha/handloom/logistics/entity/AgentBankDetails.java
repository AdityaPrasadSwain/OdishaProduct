package com.odisha.handloom.logistics.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "agent_bank_details")
@Data
public class AgentBankDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "agent_id", nullable = false, unique = true)
    private UUID agentId;

    @Column(name = "account_holder_name", nullable = false)
    private String accountHolderName;

    @Column(name = "bank_name", nullable = false)
    private String bankName;

    @Column(name = "account_number", nullable = false)
    private String accountNumber;

    @Column(name = "ifsc", nullable = false)
    private String ifsc;

    @Column(name = "upi_id")
    private String upiId;

    @Column(name = "verified", nullable = false)
    private Boolean verified = false;

    public boolean isVerified() {
        return Boolean.TRUE.equals(verified);
    }

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
