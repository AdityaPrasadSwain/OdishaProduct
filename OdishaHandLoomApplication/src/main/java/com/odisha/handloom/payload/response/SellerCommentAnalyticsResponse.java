package com.odisha.handloom.payload.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class SellerCommentAnalyticsResponse {
    private long totalComments;
    private long totalReplies;
    private long totalCommentLikes;
    private TopReelStats topReel;
    private MostLikedCommentStats mostLikedComment;

    @Data
    @Builder
    public static class TopReelStats {
        private UUID reelId;
        private String caption;
        private long commentsCount;
    }

    @Data
    @Builder
    public static class MostLikedCommentStats {
        private UUID commentId;
        private String content;
        private String userName;
        private long likesCount;
    }
}
