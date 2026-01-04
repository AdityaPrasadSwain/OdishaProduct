package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reel_view_logs")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReelViewLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reel_id", nullable = false)
    private Product reel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Optional, for logged-in users

    private String ipAddress; // For anonymous users

    @CreationTimestamp
    private LocalDateTime viewedAt;

    public void setReel(Product reel) {
        this.reel = reel;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public Product getReel() {
        return reel;
    }

    public User getUser() {
        return user;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setViewer(User viewer) {
        this.user = viewer;
    }

    public User getViewer() {
        return this.user;
    }

    public void setSessionId(String sessionId) {
        this.ipAddress = sessionId;
    }

    public String getSessionId() {
        return this.ipAddress;
    }
}
