package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reel_analytics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReelAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reel_id", nullable = false, unique = true)
    private Product reel;

    @Builder.Default
    private long totalViews = 0;
    @Builder.Default
    private long totalLikes = 0;
    @Builder.Default
    private long totalReach = 0; // Distinct viewers

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
