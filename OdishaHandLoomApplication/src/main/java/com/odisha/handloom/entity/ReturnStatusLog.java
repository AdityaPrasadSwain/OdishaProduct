package com.odisha.handloom.entity;

import com.odisha.handloom.enums.ReturnStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "return_status_logs")
public class ReturnStatusLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "return_request_id", nullable = false)
    private ReturnRequest returnRequest;

    @Enumerated(EnumType.STRING)
    private ReturnStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnStatus newStatus;

    private UUID changedBy; // User ID

    @CreationTimestamp
    private LocalDateTime changedAt;

    public ReturnStatusLog() {
    }

    public ReturnStatusLog(ReturnRequest returnRequest, ReturnStatus oldStatus, ReturnStatus newStatus,
            UUID changedBy) {
        this.returnRequest = returnRequest;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ReturnRequest getReturnRequest() {
        return returnRequest;
    }

    public void setReturnRequest(ReturnRequest returnRequest) {
        this.returnRequest = returnRequest;
    }

    public ReturnStatus getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(ReturnStatus oldStatus) {
        this.oldStatus = oldStatus;
    }

    public ReturnStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(ReturnStatus newStatus) {
        this.newStatus = newStatus;
    }

    public UUID getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(UUID changedBy) {
        this.changedBy = changedBy;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }
}
