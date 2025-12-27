package com.odisha.handloom.payload.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class SellerProfileResponse {
    private UUID sellerId;
    private String shopName;
    private String profileImageUrl;
    private String bio;

    // Stats
    private long postsCount;
    private long followersCount;
    private long followingCount;

    // Auth context
    private boolean isFollowing;

    // Content
    private List<ReelDTO> reels;

    @Data
    @Builder
    public static class ReelDTO {
        private UUID productId;
        private String videoUrl;
        private String thumbnailUrl;
        private String title;
        private long views;
        // Add more if needed
    }
}
