package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.ReelAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReelAnalyticsRepository extends JpaRepository<ReelAnalytics, UUID> {
    Optional<ReelAnalytics> findByReel(Product reel);
}
