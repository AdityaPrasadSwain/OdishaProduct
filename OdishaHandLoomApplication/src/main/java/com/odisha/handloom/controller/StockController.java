package com.odisha.handloom.controller;

import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.service.StockNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/stock")
public class StockController {

    @Autowired
    private StockNotificationService stockNotificationService;

    @PostMapping("/{productId}/notify-me")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<?> notifyMe(@PathVariable UUID productId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        try {
            stockNotificationService.createNotificationRequest(productId, email);
            return ResponseEntity.ok(new MessageResponse("You have been added to the waitlist!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
