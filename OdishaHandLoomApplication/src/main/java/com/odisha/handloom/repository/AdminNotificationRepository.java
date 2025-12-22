package com.odisha.handloom.repository;

import com.odisha.handloom.entity.AdminNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AdminNotificationRepository extends JpaRepository<AdminNotification, UUID> {

    @Query("SELECT COUNT(n) FROM AdminNotification n WHERE n.isRead = false")
    long countUnreadNotifications();

    Page<AdminNotification> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Modifying
    @Query("UPDATE AdminNotification n SET n.isRead = true WHERE n.isRead = false")
    void markAllAsRead();
}
