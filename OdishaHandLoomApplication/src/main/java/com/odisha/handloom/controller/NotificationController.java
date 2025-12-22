package com.odisha.handloom.controller;

import com.odisha.handloom.payload.response.NotificationResponse;
import com.odisha.handloom.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(notificationService.getUserNotifications(auth.getName()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(notificationService.getUnreadCount(auth.getName()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        notificationService.markAsRead(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        notificationService.markAllAsRead(auth.getName()); // Passed email
        return ResponseEntity.ok().build();
    }
}
