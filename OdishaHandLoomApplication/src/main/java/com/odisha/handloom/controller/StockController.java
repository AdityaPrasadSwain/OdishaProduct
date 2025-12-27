package com.odisha.handloom.controller;

import com.odisha.handloom.service.StockService;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StockController {

    @Autowired
    private StockService stockService;

    @Autowired
    private UserRepository userRepository;

    // Used internally or by Order Service, but exposed securily
    @PostMapping("/{productId}/reduce")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')") // Usually triggered by customer order placement
    public ResponseEntity<?> reduceStock(@PathVariable UUID productId, @RequestParam int quantity) {
        try {
            stockService.reduceStock(productId, quantity);
            return ResponseEntity.ok("Stock reduced successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{productId}/add")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<?> addStock(@PathVariable UUID productId, @RequestParam int quantity) {
        try {
            stockService.addStock(productId, quantity);
            return ResponseEntity.ok("Stock added successfully. Notifications sent if applicable.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{productId}/notify-me")
    public ResponseEntity<?> notifyMe(@PathVariable UUID productId) {
        // Get current logged in user email if available
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email;
        UUID userId = null;

        if (authentication != null && authentication.isAuthenticated()
                && !authentication.getPrincipal().equals("anonymousUser")) {
            email = authentication.getName();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                userId = user.getId();
            }
        } else {
            // For guest users, we might need to accept email in body.
            // But for now requirement implies "Customer" which usually means logged IN.
            // If requirements strictly said "Peaceful user communication", I assume
            // authenticated flow for better UX.
            return ResponseEntity.status(401).body("Please log in to subscribe for notifications.");
        }

        try {
            String message = stockService.subscribeToStock(productId, email, userId);
            // Returning a JSON object for easier frontend consumption or just string
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
