package com.odisha.handloom.controller;

import com.odisha.handloom.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{sellerId}")
    public ResponseEntity<?> followSeller(@PathVariable UUID sellerId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        followService.followSeller(sellerId, auth.getName());
        return ResponseEntity.ok().body(Map.of("message", "Followed successfully"));
    }

    @DeleteMapping("/{sellerId}")
    public ResponseEntity<?> unfollowSeller(@PathVariable UUID sellerId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        followService.unfollowSeller(sellerId, auth.getName());
        return ResponseEntity.ok().body(Map.of("message", "Unfollowed successfully"));
    }

    @GetMapping("/{sellerId}/status")
    public ResponseEntity<Boolean> getFollowStatus(@PathVariable UUID sellerId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isFollowing = followService.isFollowing(sellerId, auth.getName());
        return ResponseEntity.ok(isFollowing);
    }

    @GetMapping("/sellers")
    public ResponseEntity<java.util.List<UUID>> getFollowedSellers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        java.util.List<UUID> followedSellers = followService.getFollowedSellerIds(auth.getName());
        return ResponseEntity.ok(followedSellers);
    }
}
