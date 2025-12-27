package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.SellerFollower;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.SellerFollowerRepository;
import com.odisha.handloom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/sellers")
@RequiredArgsConstructor
public class PublicSellerController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final SellerFollowerRepository sellerFollowerRepository;

    @GetMapping("/{id}/profile")
    public ResponseEntity<?> getSellerProfile(@PathVariable UUID id) {
        User seller = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", seller.getId());
        response.put("name", seller.getFullName());
        response.put("shopName", seller.getShopName());
        response.put("bio", seller.getBio());
        response.put("profileImage", seller.getProfilePictureUrl());
        response.put("isVerified", seller.isApproved()); // Assuming approved means verified

        // Stats
        response.put("followersCount", seller.getFollowersCount() != null ? seller.getFollowersCount() : 0);
        response.put("followingCount", seller.getFollowingCount() != null ? seller.getFollowingCount() : 0);

        long postsCount = productRepository.countBySeller(seller);
        response.put("postsCount", postsCount);

        // Check if current user is following
        boolean isFollowing = false;
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                String email = auth.getName();
                User currentUser = userRepository.findByEmail(email).orElse(null);
                if (currentUser != null) {
                    isFollowing = sellerFollowerRepository.existsBySellerAndUser(seller, currentUser);
                }
            }
        } catch (Exception e) {
            // ignore
        }
        response.put("isFollowing", isFollowing);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<?> getSellerPosts(@PathVariable UUID id) {
        User seller = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        // Fetch products that are NOT reels (or all products if you want mixed)
        // For now, let's assume all products are posts unless they are reels
        List<Product> products = productRepository.findBySeller(seller);

        // Filter out reels if you have a way to distinguish (e.g. reelUrl is not null)
        // Or just return everything for now

        List<Map<String, Object>> posts = products.stream()
                .filter(p -> p.getReelUrl() == null) // Assuming posts don't have reelUrl
                .map(this::mapProductToPostSummary)
                .collect(Collectors.toList());

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}/reels")
    public ResponseEntity<?> getSellerReels(@PathVariable UUID id) {
        User seller = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        List<Product> products = productRepository.findBySeller(seller);

        List<Map<String, Object>> reels = products.stream()
                .filter(p -> p.getReelUrl() != null)
                .map(this::mapProductToPostSummary)
                .collect(Collectors.toList());

        return ResponseEntity.ok(reels);
    }

    private Map<String, Object> mapProductToPostSummary(Product p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("name", p.getName());
        map.put("price", p.getPrice());
        // Use first image as thumbnail
        if (p.getImages() != null && !p.getImages().isEmpty()) {
            map.put("thumbnail", p.getImages().get(0));
        }
        map.put("type", p.getReelUrl() != null ? "REEL" : "POST");
        map.put("videoUrl", p.getReelUrl());
        return map;
    }
}
