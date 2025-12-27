package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.ReelLike;
import com.odisha.handloom.entity.SellerFollower;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.ReelLikeRepository;
import com.odisha.handloom.repository.SellerFollowerRepository;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.service.ReelInteractionService;
import com.odisha.handloom.service.SellerAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReelInteractionController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReelLikeRepository reelLikeRepository;
    private final SellerFollowerRepository sellerFollowerRepository;
    private final com.odisha.handloom.repository.ReelCommentRepository reelCommentRepository;
    private final SellerAnalyticsService sellerAnalyticsService;
    private final ReelInteractionService reelInteractionService;
    private final com.odisha.handloom.service.NotificationService notificationService;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // --- REEL LIKES ---

    private UUID parseUUID(String id) {
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid UUID format: " + id);
            return null;
        }
    }

    // --- REEL LIKES ---

    @PostMapping("/reels/{id}/like")
    public ResponseEntity<?> likeReel(@PathVariable String id) {
        UUID reelId = parseUUID(id);
        if (reelId == null)
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid UUID"));

        User user = getAuthenticatedUser();
        Product reel = productRepository.findById(reelId)
                .orElseThrow(() -> new RuntimeException("Reel not found"));

        if (reelLikeRepository.existsByReelAndUser(reel, user)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Already liked"));
        }

        ReelLike like = ReelLike.builder()
                .reel(reel)
                .user(user)
                .build();
        reelLikeRepository.save(like);

        // Update Analytics
        sellerAnalyticsService.updateLikeCount(reel, 1);

        // Trigger Notification
        notificationService.createNotification(
                reel.getSeller(),
                user.getFullName() + " liked your reel",
                com.odisha.handloom.entity.Notification.NotificationType.LIKE,
                user,
                null,
                reel.getId(),
                null);

        return ResponseEntity.ok(new MessageResponse("Reel liked"));
    }

    @DeleteMapping("/reels/{id}/like")
    public ResponseEntity<?> unlikeReel(@PathVariable String id) {
        UUID reelId = parseUUID(id);
        if (reelId == null)
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid UUID"));

        User user = getAuthenticatedUser();
        Product reel = productRepository.findById(reelId)
                .orElseThrow(() -> new RuntimeException("Reel not found"));

        ReelLike like = reelLikeRepository.findByReelAndUser(reel, user)
                .orElseThrow(() -> new RuntimeException("Like not found"));

        reelLikeRepository.delete(like);

        // Update Analytics
        sellerAnalyticsService.updateLikeCount(reel, -1);

        return ResponseEntity.ok(new MessageResponse("Reel unliked"));
    }

    @GetMapping("/reels/{id}/likes/count")
    public ResponseEntity<?> getLikeCount(@PathVariable String id) {
        UUID reelId = parseUUID(id);
        if (reelId == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid UUID"));

        Product reel = productRepository.findById(reelId)
                .orElseThrow(() -> new RuntimeException("Reel not found"));
        long count = reelLikeRepository.countByReel(reel);

        boolean isLiked = false;
        try {
            User user = getAuthenticatedUser();
            isLiked = reelLikeRepository.existsByReelAndUser(reel, user);
        } catch (Exception e) {
            // User not logged in, ignore
        }

        return ResponseEntity.ok(Map.of("count", count, "isLiked", isLiked));
    }

    @GetMapping("/reels/{id}/comments/count")
    public ResponseEntity<?> getCommentCount(@PathVariable String id) {
        UUID reelId = parseUUID(id);
        if (reelId == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid UUID"));

        Product reel = productRepository.findById(reelId)
                .orElseThrow(() -> new RuntimeException("Reel not found"));
        long count = reelInteractionService.getReelCommentCount(reel);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/reels/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable String id) {
        UUID reelId = parseUUID(id);
        if (reelId == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid UUID"));

        User user = null;
        try {
            user = getAuthenticatedUser();
        } catch (Exception e) {
            // Allow public viewing
        }
        var comments = reelInteractionService.getCommentsForReel(reelId, user != null ? user.getEmail() : null);
        System.out.println("Fetching comments for reel " + reelId + ": found " + comments.size());
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/reels/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable String id,
            @jakarta.validation.Valid @RequestBody com.odisha.handloom.payload.request.ReplyCommentRequest request) {
        UUID reelId = parseUUID(id);
        if (reelId == null)
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid UUID"));

        User user = getAuthenticatedUser();
        return ResponseEntity.ok(reelInteractionService.addComment(reelId, request, user.getEmail()));
    }

    @PostMapping("/comments/{commentId}/reply")
    public ResponseEntity<?> replyToComment(@PathVariable String commentId,
            @jakarta.validation.Valid @RequestBody com.odisha.handloom.payload.request.ReplyCommentRequest request) {
        UUID parentId = parseUUID(commentId);
        if (parentId == null)
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid UUID"));

        User user = getAuthenticatedUser();

        com.odisha.handloom.entity.ReelComment parentComment = reelCommentRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));

        UUID reelId = parentComment.getReel().getId();

        return ResponseEntity.ok(reelInteractionService.replyToComment(reelId, parentId, request, user.getEmail()));
    }

    // ... (rest of the file until followSeller) ...

    // --- SELLER FOLLOWS ---

    @PostMapping("/sellers/{id}/follow")
    public ResponseEntity<?> followSeller(
            @PathVariable UUID id,
            @RequestParam(required = false) String source, // "REEL" or "PROFILE"
            @RequestParam(required = false) UUID reelId) { // If source is REEL

        User user = getAuthenticatedUser();
        User seller = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (user.getId().equals(seller.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Cannot follow yourself"));
        }

        if (sellerFollowerRepository.existsBySellerAndUser(seller, user)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Already following"));
        }

        SellerFollower follower = SellerFollower.builder()
                .seller(seller)
                .user(user)
                .followSource(source != null ? source : "PROFILE")
                .sourceReelId(reelId)
                .build();
        sellerFollowerRepository.save(follower);

        // Update Counts
        seller.setFollowersCount(seller.getFollowersCount() + 1);
        userRepository.save(seller);

        user.setFollowingCount(user.getFollowingCount() + 1);
        userRepository.save(user);

        // Trigger Notification
        notificationService.createNotification(
                seller,
                user.getFullName() + " started following you",
                com.odisha.handloom.entity.Notification.NotificationType.FOLLOW,
                user,
                null,
                null,
                null);

        return ResponseEntity.ok(new MessageResponse("Followed successfully"));
    }

    @DeleteMapping("/sellers/{id}/follow")
    public ResponseEntity<?> unfollowSeller(@PathVariable UUID id) {
        User user = getAuthenticatedUser();
        User seller = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        SellerFollower follower = sellerFollowerRepository.findBySellerAndUser(seller, user)
                .orElseThrow(() -> new RuntimeException("Not following"));

        sellerFollowerRepository.delete(follower);

        // Update Counts
        if (seller.getFollowersCount() > 0) {
            seller.setFollowersCount(seller.getFollowersCount() - 1);
            userRepository.save(seller);
        }

        if (user.getFollowingCount() > 0) {
            user.setFollowingCount(user.getFollowingCount() - 1);
            userRepository.save(user);
        }

        return ResponseEntity.ok(new MessageResponse("Unfollowed successfully"));
    }

    @GetMapping("/sellers/{id}/followers/count")
    public ResponseEntity<?> getFollowerCount(@PathVariable UUID id) {
        User seller = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        long count = sellerFollowerRepository.countBySeller(seller);

        boolean isFollowing = false;
        try {
            User user = getAuthenticatedUser();
            isFollowing = sellerFollowerRepository.existsBySellerAndUser(seller, user);
        } catch (Exception e) {
            // User not logged in
        }

        return ResponseEntity.ok(Map.of("count", count, "isFollowing", isFollowing));
    }
}
