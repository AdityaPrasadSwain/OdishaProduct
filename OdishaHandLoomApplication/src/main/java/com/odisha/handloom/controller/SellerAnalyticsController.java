package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.*;
import com.odisha.handloom.service.SellerAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seller/analytics")
@RequiredArgsConstructor
public class SellerAnalyticsController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReelLikeRepository reelLikeRepository;
    private final ReelCommentRepository reelCommentRepository;
    private final SellerFollowerRepository sellerFollowerRepository;

    private final SellerAnalyticsService sellerAnalyticsService;

    private User getAuthenticatedSeller() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Assuming role check is handled by security config or helper
        return user;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        User seller = getAuthenticatedSeller();

        long followers = sellerFollowerRepository.countBySeller(seller);

        List<Product> reels = productRepository.findBySellerId(seller.getId()).stream()
                .filter(p -> p.getReelUrl() != null && !p.getReelUrl().isEmpty())
                .collect(Collectors.toList());

        long totalReels = reels.size();
        long totalLikes = 0;
        long totalComments = 0;

        for (Product reel : reels) {
            totalLikes += reelLikeRepository.countByReel(reel);
            totalComments += reelCommentRepository.countByReel(reel);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("followers", followers);
        stats.put("totalReels", totalReels);
        stats.put("totalLikes", totalLikes);
        stats.put("totalComments", totalComments);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/comments")
    public ResponseEntity<?> getCommentAnalytics() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(sellerAnalyticsService.getCommentAnalytics(auth.getName()));
    }

    @GetMapping("/reels")
    public ResponseEntity<List<Map<String, Object>>> getReelStats() {
        User seller = getAuthenticatedSeller();

        List<Product> reels = productRepository.findBySellerId(seller.getId()).stream()
                .filter(p -> p.getReelUrl() != null && !p.getReelUrl().isEmpty())
                .collect(Collectors.toList());

        System.out.println("DEBUG: Seller ID: " + seller.getId());
        System.out.println("DEBUG: Total Products found: " + productRepository.findBySellerId(seller.getId()).size());
        System.out.println("DEBUG: Reels found (filtered): " + reels.size());

        List<Map<String, Object>> reelStats = reels.stream().map(reel -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", reel.getId());
            map.put("thumbnailUrl", reel.getReelUrl().replace("/upload/", "/upload/so_auto,w_150,q_auto,f_jpg/")
                    .replace(".mp4", ".jpg")); // Quick thumb gen
            map.put("videoUrl", reel.getReelUrl());
            map.put("caption", reel.getReelCaption());
            map.put("likes", reelLikeRepository.countByReel(reel));
            map.put("comments", reelCommentRepository.countByReel(reel));
            map.put("createdAt", reel.getCreatedAt()); // Assuming audit field or logic exists, otherwise null
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(reelStats);
    }
}
