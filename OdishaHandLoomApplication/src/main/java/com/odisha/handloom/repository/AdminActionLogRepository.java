package com.odisha.handloom.repository;

import com.odisha.handloom.entity.AdminActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdminActionLogRepository extends JpaRepository<AdminActionLog, UUID> {
    List<AdminActionLog> findBySellerIdOrderByCreatedAtDesc(UUID sellerId);
}
