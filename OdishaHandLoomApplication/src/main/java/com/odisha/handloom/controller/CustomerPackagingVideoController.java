package com.odisha.handloom.controller;

import com.odisha.handloom.entity.PackagingVideo;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.PackagingVideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/customer/order")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerPackagingVideoController {

    @Autowired
    private PackagingVideoService videoService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{orderId}/packaging-video")
    public ResponseEntity<?> getPackagingVideo(@PathVariable UUID orderId) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User customer = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            PackagingVideo video = videoService.getVideoForCustomer(orderId, customer.getId());
            return ResponseEntity.ok(video); // Returns full object including URL
        } catch (Exception e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
