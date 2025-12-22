package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Notification;
import com.odisha.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    // Fetch user notifications
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    // Count unread
    long countByUserAndIsReadFalse(User user);

    // Find specific notification owned by user (for security)
    Optional<Notification> findByIdAndUser(UUID id, User user);

    // Bulk read - FIX: Added Param annotation as good practice
    @Modifying
    @Query("UPDATE Notification n SET n.isRead=true WHERE n.user=:user AND n.isRead=false")
    void markAllAsReadByUser(@Param("user") User user);
}
