package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reel_view_logs", indexes = {
        @Index(name = "idx_view_reel_user", columnList = "reel_id, viewer_id"),
        @Index(name = "idx_view_reel_session", columnList = "reel_id, sessionId")
})
@Data
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
    @JoinColumn(name = "viewer_id", nullable = true) // Can be null if anonymous
    private User viewer;

    private String sessionId; // Helper for anonymous reach tracking (optional, or IP hash)

    @CreationTimestamp
    private LocalDateTime viewedAt;
}
