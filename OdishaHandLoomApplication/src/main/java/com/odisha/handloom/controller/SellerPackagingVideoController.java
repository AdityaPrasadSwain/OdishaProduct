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
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/seller/packaging")
@PreAuthorize("hasRole('SELLER')")
public class SellerPackagingVideoController {

    @Autowired
    private PackagingVideoService videoService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload/{orderId}")
    public ResponseEntity<?> uploadVideo(@PathVariable UUID orderId, @RequestParam("file") MultipartFile file) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User seller = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Seller not found"));

            PackagingVideo video = videoService.uploadVideo(orderId, seller.getId(), file);
            return ResponseEntity.ok(video);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
