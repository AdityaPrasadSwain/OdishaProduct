package com.odisha.handloom.service;

import com.odisha.handloom.entity.Notification;
import com.odisha.handloom.entity.SellerFollower;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.SellerFollowerRepository;
import com.odisha.handloom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FollowService {

        private final SellerFollowerRepository sellerFollowerRepository;
        private final UserRepository userRepository;
        private final NotificationService notificationService;

        @Transactional
        public void followSeller(UUID sellerId, String followerEmail) {
                User follower = userRepository.findByEmail(followerEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                User seller = userRepository.findById(sellerId)
                                .orElseThrow(() -> new RuntimeException("Seller not found"));

                // Validation: Prevent self-follow
                if (seller.getId().equals(follower.getId())) {
                        throw new RuntimeException("You cannot follow yourself");
                }

                // Check if already following
                if (sellerFollowerRepository.existsBySellerAndUser(seller, follower)) {
                        return; // Already following
                }

                // Save Follow
                SellerFollower follow = SellerFollower.builder()
                                .seller(seller)
                                .user(follower)
                                .build();

                sellerFollowerRepository.save(follow);

                // Create Notification
                notificationService.createNotification(
                                seller,
                                follower.getFullName() + " started following you",
                                Notification.NotificationType.FOLLOW,
                                follower, // Sender
                                null, null, null // No generic IDs
                );
        }

        @Transactional
        public void unfollowSeller(UUID sellerId, String followerEmail) {
                User follower = userRepository.findByEmail(followerEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                User seller = userRepository.findById(sellerId)
                                .orElseThrow(() -> new RuntimeException("Seller not found"));

                sellerFollowerRepository.findBySellerAndUser(seller, follower)
                                .ifPresent(sellerFollowerRepository::delete);
        }

        @Transactional(readOnly = true)
        public boolean isFollowing(UUID sellerId, String followerEmail) {
                User follower = userRepository.findByEmail(followerEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                User seller = userRepository.findById(sellerId)
                                .orElseThrow(() -> new RuntimeException("Seller not found"));

                return sellerFollowerRepository.existsBySellerAndUser(seller, follower);
        }

        @Transactional(readOnly = true)
        public java.util.List<UUID> getFollowedSellerIds(String followerEmail) {
                User follower = userRepository.findByEmail(followerEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return sellerFollowerRepository.findAllByUser(follower).stream()
                                .map(follow -> follow.getSeller().getId())
                                .collect(java.util.stream.Collectors.toList());
        }
}
