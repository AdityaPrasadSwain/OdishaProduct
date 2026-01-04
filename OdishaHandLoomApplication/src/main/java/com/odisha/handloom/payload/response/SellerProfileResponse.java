package com.odisha.handloom.payload.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@lombok.AllArgsConstructor
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

    public static class ReelDTO {
        private UUID productId;
        private String videoUrl;
        private String thumbnailUrl;
        private String title;
        private long views;

        public ReelDTO() {
        }

        public UUID getProductId() {
            return productId;
        }

        public void setProductId(UUID productId) {
            this.productId = productId;
        }

        public String getVideoUrl() {
            return videoUrl;
        }

        public void setVideoUrl(String videoUrl) {
            this.videoUrl = videoUrl;
        }

        public String getThumbnailUrl() {
            return thumbnailUrl;
        }

        public void setThumbnailUrl(String thumbnailUrl) {
            this.thumbnailUrl = thumbnailUrl;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public long getViews() {
            return views;
        }

        public void setViews(long views) {
            this.views = views;
        }
    }

    public SellerProfileResponse() {
    }

    public UUID getSellerId() {
        return sellerId;
    }

    public void setSellerId(UUID sellerId) {
        this.sellerId = sellerId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public long getPostsCount() {
        return postsCount;
    }

    public void setPostsCount(long postsCount) {
        this.postsCount = postsCount;
    }

    public long getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(long followersCount) {
        this.followersCount = followersCount;
    }

    public long getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(long followingCount) {
        this.followingCount = followingCount;
    }

    public boolean isFollowing() {
        return isFollowing;
    }

    public void setFollowing(boolean following) {
        isFollowing = following;
    }

    public List<ReelDTO> getReels() {
        return reels;
    }

    public void setReels(List<ReelDTO> reels) {
        this.reels = reels;
    }
}
