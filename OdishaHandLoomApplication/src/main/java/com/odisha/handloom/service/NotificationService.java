package com.odisha.handloom.service;

import com.odisha.handloom.entity.Notification;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.response.NotificationResponse;
import com.odisha.handloom.repository.NotificationRepository;
import com.odisha.handloom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createNotification(User recipient, String message, Notification.NotificationType type,
            User sender, UUID orderId, UUID reelId, UUID commentId) {
        if (recipient == null)
            return;

        // Don't notify self (unless system)
        if (sender != null && sender.getId().equals(recipient.getId())) {
            return;
        }

        Notification notification = Notification.builder()
                .user(recipient)
                .sender(sender) // Can be null
                .type(type)
                .message(message)
                .isRead(false)
                .orderId(orderId)
                .reelId(reelId)
                .commentId(commentId)
                .build();

        notificationRepository.save(notification);
    }

    // Overload for System notifications (no sender)
    @Transactional
    public void createSystemNotification(User recipient, String message) {
        createNotification(recipient, message, Notification.NotificationType.SYSTEM, null, null, null, null);
    }

    // Helper for legacy generic notifications (mapped to SYSTEM)
    @Transactional
    public void createNotification(User recipient, String title, String message) {
        createSystemNotification(recipient, title + ": " + message);
    }

    // Helper for Reply notifications (mapped to COMMENT)
    @Transactional
    public void createReplyNotification(User recipient, User sender, UUID reelId, UUID commentId) {
        createNotification(recipient, sender.getFullName() + " replied to your comment",
                Notification.NotificationType.COMMENT, sender, null, reelId, commentId);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void markAsRead(UUID id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Notification not found or unauthorized"));

        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email) // Fix: Use email to fetch user
                .orElseThrow(() -> new RuntimeException("User not found"));
        notificationRepository.markAllAsReadByUser(user); // Fix: Use markAllAsReadByUser
    }

    // Overload for User object if needed
    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadByUser(user);
    }

    private NotificationResponse mapToResponse(Notification n) {
        // FIX: Null-safe sender check as requested
        return NotificationResponse.builder()
                .id(n.getId())
                .message(n.getMessage())
                .type(n.getType().name())
                .isRead(n.isRead())
                .senderName(n.getSender() == null ? "System" : n.getSender().getFullName())
                .createdAt(n.getCreatedAt())
                .orderId(n.getOrderId())
                .reelId(n.getReelId())
                .commentId(n.getCommentId())
                .build();
    }
}
