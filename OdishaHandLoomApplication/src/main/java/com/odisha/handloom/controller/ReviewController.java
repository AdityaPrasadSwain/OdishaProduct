package com.odisha.handloom.controller;

import com.odisha.handloom.dto.ReviewDTO;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ReviewDTO.Response> submitReview(
            @RequestPart("reviewData") ReviewDTO.Request request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Principal principal) throws IOException {

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(reviewService.submitReview(user.getId(), request, images));
    }

    @PutMapping(value = "/{reviewId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<ReviewDTO.Response> editReview(
            @PathVariable UUID reviewId,
            @RequestPart("reviewData") ReviewDTO.Request request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Principal principal) throws IOException {

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Note: ReviewService.editReview logic checks if user owns review implicitly
        // via logic,
        // but currently ReviewService.editReview just grabs strictly by reviewId.
        // I will add ownership check in Service for better encapsulation.

        return ResponseEntity.ok(reviewService.editReview(user.getId(), reviewId, request, images));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO.Response>> getProductReviews(@PathVariable UUID productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @GetMapping("/check-eligibility")
    public ResponseEntity<Boolean> checkEligibility(
            @RequestParam UUID orderItemId,
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(reviewService.canReview(user.getId(), orderItemId));
    }

    @GetMapping("/eligibility/product/{productId}")
    public ResponseEntity<UUID> checkProductEligibility(
            @PathVariable UUID productId,
            Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(reviewService.getEligibleOrderItemId(user.getId(), productId));
    }

    @GetMapping("/order-item/{orderItemId}")
    public ResponseEntity<ReviewDTO.Response> getReviewByOrderItem(@PathVariable UUID orderItemId) {
        return ResponseEntity.ok(reviewService.getReviewByOrderItemId(orderItemId));
    }
}
