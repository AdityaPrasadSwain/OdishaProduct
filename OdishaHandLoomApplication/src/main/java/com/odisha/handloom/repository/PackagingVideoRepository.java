package com.odisha.handloom.repository;

import com.odisha.handloom.entity.PackagingVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PackagingVideoRepository extends JpaRepository<PackagingVideo, UUID> {
    Optional<PackagingVideo> findByOrderId(UUID orderId);

    Optional<PackagingVideo> findByOrderIdAndSellerId(UUID orderId, UUID sellerId);
}
