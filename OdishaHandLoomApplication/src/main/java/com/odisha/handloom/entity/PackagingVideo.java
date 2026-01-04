package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "packaging_videos")
@Data
public class PackagingVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_id", nullable = false)
    private UUID orderId;

    @Column(name = "seller_id", nullable = false)
    private UUID sellerId;

    @Column(name = "video_url", nullable = false, columnDefinition = "TEXT")
    private String videoUrl;

    @Column(name = "visible_to_customer", nullable = false)
    private Boolean visibleToCustomer = false;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    public boolean isVisibleToCustomer() {
        return Boolean.TRUE.equals(visibleToCustomer);
    }
}
