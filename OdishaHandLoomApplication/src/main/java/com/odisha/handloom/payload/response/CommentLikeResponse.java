package com.odisha.handloom.payload.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class CommentLikeResponse {
    private UUID commentId;
    private long likesCount;
    private boolean isLiked;

    public void setCommentId(UUID commentId) {
        this.commentId = commentId;
    }

    public void setLikesCount(long likesCount) {
        this.likesCount = likesCount;
    }

    public void setIsLiked(boolean isLiked) {
        this.isLiked = isLiked;
    }

    public UUID getCommentId() {
        return commentId;
    }

    public long getLikesCount() {
        return likesCount;
    }

    public boolean isLiked() {
        return isLiked;
    }
}
