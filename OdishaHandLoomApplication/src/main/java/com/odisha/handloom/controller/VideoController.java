package com.odisha.handloom.controller;

import com.odisha.handloom.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @PostMapping("/seller/packing-video/{orderId}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> uploadPackingVideo(
            @PathVariable UUID orderId,
            @RequestParam("file") MultipartFile file) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String sellerEmail = authentication.getName();

            String videoUrl = videoService.uploadPackingVideo(orderId, file, sellerEmail);
            return ResponseEntity.ok(Map.of("message", "Video uploaded successfully", "url", videoUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/customer/packing-video/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getPackingVideo(
            @PathVariable UUID orderId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String customerEmail = authentication.getName();

            String videoUrl = videoService.getPackingVideoUrlForCustomer(orderId, customerEmail);
            return ResponseEntity.ok(Map.of("url", videoUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
