package com.odisha.handloom.service;

import com.odisha.handloom.entity.AdminNotification;
import com.odisha.handloom.enums.AdminNotificationPriority;
import com.odisha.handloom.enums.AdminNotificationType;
import com.odisha.handloom.repository.AdminNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AdminNotificationService {

    @Autowired
    private AdminNotificationRepository adminNotificationRepository;

    @Transactional
    public void createNotification(AdminNotificationType type, String title, String message, UUID entityId,
            AdminNotificationPriority priority) {
        AdminNotification notification = new AdminNotification();
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setEntityId(entityId);
        notification.setPriority(priority);
        notification.setRead(false);

        adminNotificationRepository.save(notification);
    }

    public void notifySellerRegistration(UUID sellerId, String sellerName) {
        createNotification(
                AdminNotificationType.SELLER_REGISTERED,
                "New Seller Registration",
                "New seller '" + sellerName + "' registered and is pending approval.",
                sellerId,
                AdminNotificationPriority.HIGH);
    }

    public void notifyOrderCreated(UUID orderId, double amount) {
        // High value order threshold defined as 5000
        if (amount > 5000) {
            createNotification(
                    AdminNotificationType.HIGH_VALUE_ORDER,
                    "High Value Order Received",
                    "Order #" + orderId.toString().substring(0, 8) + " placed for ₹" + amount,
                    orderId,
                    AdminNotificationPriority.HIGH);
        } else {
            createNotification(
                    AdminNotificationType.ORDER_CREATED,
                    "New Order Received",
                    "Order #" + orderId.toString().substring(0, 8) + " placed for ₹" + amount,
                    orderId,
                    AdminNotificationPriority.MEDIUM);
        }
    }

    public void notifyReturnRequest(UUID returnRequestId, String orderIdSubset) {
        createNotification(
                AdminNotificationType.RETURN_REQUEST,
                "Return Request Submitted",
                "Return requested for Order #" + orderIdSubset,
                returnRequestId,
                AdminNotificationPriority.MEDIUM);
    }

    public void notifySellerApproved(UUID sellerId, String sellerName) {
        createNotification(
                AdminNotificationType.SELLER_APPROVED,
                "Seller Approved",
                "Seller '" + sellerName + "' has been approved.",
                sellerId,
                AdminNotificationPriority.LOW);
    }

    public Page<AdminNotification> getAllNotifications(Pageable pageable) {
        return adminNotificationRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public long getUnreadCount() {
        return adminNotificationRepository.countUnreadNotifications();
    }

    @Transactional
    public void markAsRead(UUID id) {
        adminNotificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            adminNotificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead() {
        adminNotificationRepository.markAllAsRead();
    }
}
