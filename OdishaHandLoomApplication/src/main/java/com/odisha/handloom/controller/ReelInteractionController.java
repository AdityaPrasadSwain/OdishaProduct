package com.odisha.handloom.controller;

import com.odisha.handloom.entity.*;
import com.odisha.handloom.repository.*;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.payload.request.ReplyCommentRequest;
import com.odisha.handloom.payload.response.CommentResponse;
import com.odisha.handloom.service.ReelInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReelInteractionController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReelLikeRepository reelLikeRepository;
    // reelCommentRepository removed, using service instead
    private final SellerFollowerRepository sellerFollowerRepository;
    private final ReelInteractionService reelInteractionService;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // --- REEL LIKES ---

    @PostMapping("/reels/{id}/like")
    public ResponseEntity<?> likeReel(@PathVariable UUID id) {
        User user = getAuthenticatedUser();
        Product reel = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reel not found"));

        if (reelLikeRepository.existsByReelAndUser(reel, user)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Already liked"));
        }

        ReelLike like = ReelLike.builder()
                .reel(reel)
                .user(user)
                .build();
        reelLikeRepository.save(like);

        return ResponseEntity.ok(new MessageResponse("Reel liked"));
    }

    @DeleteMapping("/reels/{id}/like")
    public ResponseEntity<?> unlikeReel(@PathVariable UUID id) {
        User user = getAuthenticatedUser();
        Product reel = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reel not found"));

        ReelLike like = reelLikeRepository.findByReelAndUser(reel, user)
                .orElseThrow(() -> new RuntimeException("Like not found"));

        reelLikeRepository.delete(like);

        return ResponseEntity.ok(new MessageResponse("Reel unliked"));
    }

    @GetMapping("/reels/{id}/likes/count")
    public ResponseEntity<?> getLikeCount(@PathVariable UUID id) {
        Product reel = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reel not found"));

        long count = reelLikeRepository.countByReel(reel);

        // Check if current user liked
        boolean isLiked = false;
        try {
            User user = getAuthenticatedUser();
            isLiked = reelLikeRepository.existsByReelAndUser(reel, user);
        } catch (Exception e) {
            // User not logged in, ignore
        }

        return ResponseEntity.ok(Map.of("count", count, "isLiked", isLiked));
    }

    // --- REEL COMMENTS ---

    @GetMapping("/reels/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable UUID id) {
        String email = null;
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                email = auth.getName();
            }
        } catch (Exception e) {
            // ignore
        }
        return ResponseEntity.ok(reelInteractionService.getCommentsForReel(id, email));
    }

    @GetMapping("/reels/{id}/comments/count")
    public ResponseEntity<?> getCommentCount(@PathVariable UUID id) {
        Product reel = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reel not found"));
        // We can use the service or repository directly.
        // Service would be cleaner but repository is already used in controller for
        // counts (e.g. like count).
        // But wait, the controller has `reelLikeRepository` injected but
        // `ReelCommentRepository` was removed in favor of service.
        // I should add `getCommentCount` to `ReelInteractionService` OR re-inject
        // repository?
        // Let's check imports. Repository IS imported. But variable was removed?
        // Line 27: `// reelCommentRepository removed, using service instead`
        // So I should use `reelInteractionService`.
        long count = reelInteractionService.getReelCommentCount(reel);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PostMapping("/reels/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable UUID id, @RequestBody ReplyCommentRequest request) {
        // Authenticated user email from context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        // Backward compatibility: If request comes from legacy frontend logic sending
        // map,
        // it might fail if we enforce strict ReplyCommentRequest without careful
        // frontend alignment.
        // However, we updated ReplyCommentRequest to match frontend JSON structure
        // (comment, parentId).
        // So this should bind correctly.

        CommentResponse response;
        if (request.getParentId() != null) {
            // Treat as reply if parentId is present in body
            response = reelInteractionService.replyToComment(id, request.getParentId(), request, email);
        } else {
            response = reelInteractionService.addComment(id, request, email);
        }

        return ResponseEntity.ok(response);
    }

    // STRICT ENDPOINT requested by prompt
    @PostMapping("/reels/{reelId}/comments/{commentId}/reply")
    public ResponseEntity<CommentResponse> replyToComment(
            @PathVariable UUID reelId,
            @PathVariable UUID commentId,
            @RequestBody ReplyCommentRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        CommentResponse response = reelInteractionService.replyToComment(reelId, commentId, request, email);
        return ResponseEntity.ok(response);
    }

    // COMMENT LIKE ENDPOINT
    @PostMapping("/comments/{commentId}/like")
    public ResponseEntity<?> toggleCommentLike(@PathVariable UUID commentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        return ResponseEntity.ok(reelInteractionService.toggleCommentLike(commentId, email));
    }

    // --- SELLER FOLLOWS ---

    @PostMapping("/sellers/{id}/follow")
    public ResponseEntity<?> followSeller(@PathVariable UUID id) {
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
                .build();
        sellerFollowerRepository.save(follower);

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
