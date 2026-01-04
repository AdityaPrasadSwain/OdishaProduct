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
    private Long totalViews = 0L;
    @Builder.Default
    private Long totalLikes = 0L;
    @Builder.Default
    private Long totalReach = 0L; // Distinct viewers

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void setReel(Product reel) {
        this.reel = reel;
    }

    public Product getReel() {
        return reel;
    }

    public void setTotalViews(Long totalViews) {
        this.totalViews = totalViews;
    }

    public void setTotalLikes(Long totalLikes) {
        this.totalLikes = totalLikes;
    }

    public Long getTotalLikes() {
        return totalLikes;
    }

    public Long getTotalViews() {
        return totalViews;
    }

    public void setTotalReach(Long totalReach) {
        this.totalReach = totalReach;
    }

    public Long getTotalReach() {
        return totalReach;
    }
}
