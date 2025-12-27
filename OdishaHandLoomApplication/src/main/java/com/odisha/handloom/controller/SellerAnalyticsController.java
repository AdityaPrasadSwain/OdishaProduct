package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.*;
import com.odisha.handloom.service.SellerAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SellerAnalyticsController {

    private final SellerAnalyticsService sellerAnalyticsService;
    private final ProductRepository productRepository;
    private final SellerFollowerRepository sellerFollowerRepository;
    private final ReelCommentRepository reelCommentRepository;
    private final ReelLikeRepository reelLikeRepository;
    private final ReelAnalyticsRepository reelAnalyticsRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    // --- VIEW TRACKING ---

    @PostMapping("/reels/{id}/view")
    public ResponseEntity<?> recordView(@PathVariable UUID id, @RequestParam(required = false) String sessionId) {
        User user = getAuthenticatedUser(); // Can be null if anonymous (if we allow anonymous)
        String email = user != null ? user.getEmail() : null;

        // If logged in, email is unique ID. If not, session ID is used.
        if (email == null && sessionId == null) {
            return ResponseEntity.badRequest().body("Session ID require for anonymous views");
        }

        sellerAnalyticsService.recordView(id, email, sessionId);
        return ResponseEntity.ok("View recorded");
    }

    // --- SELLER DASHBOARD ANALYTICS ---

    @GetMapping("/seller/analytics/summary")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> getAnalyticsSummary() {
        User seller = getAuthenticatedUser();
        if (seller == null)
            return ResponseEntity.status(401).build();

        System.out.println("Analytics Summary Request for Seller: " + seller.getId() + " (" + seller.getEmail() + ")");

        List<Product> reels = productRepository.findBySellerId(seller.getId()).stream()
                .filter(p -> p.getReelUrl() != null && !p.getReelUrl().isEmpty())
                .collect(Collectors.toList());

        System.out.println("Found " + reels.size() + " reels for seller.");

        long totalViews = 0;
        long totalReach = 0;

        for (Product reel : reels) {
            var analytics = reelAnalyticsRepository.findByReel(reel).orElse(null);
            if (analytics != null) {
                totalViews += analytics.getTotalViews();
                totalReach += analytics.getTotalReach();
            }
        }

        long totalComments = reelCommentRepository.countAllCommentsBySeller(seller.getId());
        long totalLikes = reelLikeRepository.countAllLikesBySeller(seller.getId());
        System.out.println("Total Comments: " + totalComments);
        System.out.println("Total Likes: " + totalLikes);

        long totalFollowers = sellerFollowerRepository.countBySeller(seller);

        // Get new followers in last 7 days
        // LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        // This would require a repository method `countBySellerAndCreatedAtAfter` -
        // Assuming simpler logic or adding repo method
        // For now, let's fetch all (optimization needed later) or just skip time-based
        // if repo not ready
        // Let's implement basic total followers first.

        // Calculate Engagement Rate
        double engagementRate = 0.0;
        if (totalViews > 0) {
            engagementRate = ((double) (totalLikes + totalComments) / totalViews) * 100;
        }

        // Calculate Revenue and Orders
        List<com.odisha.handloom.entity.Order> sellerOrders = orderRepository.findBySellerId(seller.getId());
        long totalOrders = sellerOrders.stream()
                .filter(o -> o.getStatus() != com.odisha.handloom.entity.OrderStatus.CANCELLED)
                .count();

        double totalRevenue = sellerOrders.stream()
                .filter(o -> o.getStatus() != com.odisha.handloom.entity.OrderStatus.CANCELLED)
                .mapToDouble(o -> o.getTotalAmount().doubleValue())
                .sum();

        Map<String, Object> response = new HashMap<>();
        response.put("totalViews", totalViews);
        response.put("totalReach", totalReach);
        response.put("reach", totalReach); // key expected by frontend
        response.put("totalLikes", totalLikes);
        response.put("totalFollowers", totalFollowers);
        response.put("totalReels", (long) reels.size());
        response.put("totalComments", totalComments);
        response.put("totalOrders", totalOrders);
        response.put("totalRevenue", totalRevenue);
        response.put("engagementRate", Math.round(engagementRate * 10.0) / 10.0); // Round to 1 decimal

        // Profile Sync Data
        response.put("profilePictureUrl", seller.getProfilePictureUrl());
        response.put("shopName", seller.getShopName());
        response.put("bio", seller.getBio());
        // Simple website link simulation if needed, or leave to frontend

        return ResponseEntity.ok(response);
    }

    @GetMapping("/seller/analytics/reels")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> getReelAnalytics() {
        try {
            User seller = getAuthenticatedUser();
            if (seller == null)
                return ResponseEntity.status(401).build();

            System.out.println("Fetching reels for seller: " + seller.getId());

            List<Product> reels = productRepository.findBySellerId(seller.getId()).stream()
                    .filter(p -> p.getReelUrl() != null && !p.getReelUrl().isEmpty())
                    .collect(Collectors.toList());

            System.out.println("Found " + reels.size() + " potential reels.");

            List<Map<String, Object>> result = new ArrayList<>();

            for (Product reel : reels) {
                try {
                    var analytics = reelAnalyticsRepository.findByReel(reel).orElse(null);
                    long views = analytics != null ? analytics.getTotalViews() : 0;
                    long reach = analytics != null ? analytics.getTotalReach() : 0;
                    long likes = reelLikeRepository.countByReel(reel);
                    long comments = reelCommentRepository.countByReel(reel);

                    Integer soldCount = orderItemRepository.sumQuantityByProduct(reel.getId());
                    long totalSold = soldCount != null ? soldCount : 0;

                    String thumbnailUrl = null;
                    if (reel.getImages() != null && !reel.getImages().isEmpty()) {
                        thumbnailUrl = reel.getImages().get(0).getImageUrl();
                    }

                    // Fallback to Cloudinary thumbnail generation
                    if (thumbnailUrl == null && reel.getReelUrl() != null && reel.getReelUrl().contains("/upload/")) {
                        String videoUrl = reel.getReelUrl();
                        // Insert transformation before /v[version]/ or before file name if version
                        // missing
                        // Easiest safe replace for standard Cloudinary URL
                        String replacement = "/upload/so_auto,w_450,q_auto,f_jpg/";
                        if (videoUrl.contains("/upload/")) {
                            thumbnailUrl = videoUrl.replaceFirst("/upload/", replacement);
                            if (thumbnailUrl.endsWith(".mp4")) {
                                thumbnailUrl = thumbnailUrl.substring(0, thumbnailUrl.lastIndexOf(".")) + ".jpg";
                            }
                        }
                    }

                    Map<String, Object> map = new HashMap<>();
                    map.put("id", reel.getId());
                    map.put("reelId", reel.getId());
                    map.put("videoUrl", reel.getReelUrl());
                    map.put("thumbnailUrl", thumbnailUrl); // Can be null, frontend should handle or we give default
                    map.put("title", reel.getName());
                    map.put("views", views);
                    map.put("reach", reach);
                    map.put("likes", likes);
                    map.put("views", views);
                    map.put("reach", reach);
                    map.put("likes", likes);
                    map.put("comments", comments);
                    map.put("totalSold", totalSold);

                    result.add(map);
                } catch (Exception e) {
                    System.err.println("Error processing reel " + reel.getId() + ": " + e.getMessage());
                    e.printStackTrace();
                }
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error in getReelAnalytics: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching reels");
        }
    }

    @GetMapping("/reels/{id}/analytics")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> getSingleReelAnalytics(@PathVariable UUID id) {
        try {
            User seller = getAuthenticatedUser();
            Product reel = productRepository.findById(id).orElse(null);

            if (reel == null)
                return ResponseEntity.notFound().build();
            // Security check: ensure reel belongs to seller
            if (!reel.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.status(403).body("Unauthorized access to reel analytics");
            }

            var analytics = reelAnalyticsRepository.findByReel(reel).orElse(null);
            long views = analytics != null ? analytics.getTotalViews() : 0;
            long reach = analytics != null ? analytics.getTotalReach() : 0;
            long likes = reelLikeRepository.countByReel(reel);
            long comments = reelCommentRepository.countByReel(reel);

            Integer soldCount = orderItemRepository.sumQuantityByProduct(reel.getId());
            long totalSold = soldCount != null ? soldCount : 0;

            Map<String, Object> map = new HashMap<>();
            map.put("id", reel.getId());
            map.put("views", views);
            map.put("reach", reach);
            map.put("likes", likes);
            map.put("comments", comments);
            map.put("totalSold", totalSold);

            return ResponseEntity.ok(map);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching reel analytics");
        }
    }
}
