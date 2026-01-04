package com.odisha.handloom.repository;

import com.odisha.handloom.entity.PackingVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PackingVideoRepository extends JpaRepository<PackingVideo, Long> {
    Optional<PackingVideo> findByOrderId(UUID orderId);
}
