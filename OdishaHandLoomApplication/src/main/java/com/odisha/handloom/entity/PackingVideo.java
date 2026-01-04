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
@Table(name = "packing_videos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackingVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true) // One video per order
    private UUID orderId;

    @Column(nullable = false)
    private UUID sellerId;

    @Column(nullable = false, length = 1000)
    private String videoUrl;

    @CreationTimestamp
    private LocalDateTime uploadedAt;
}
