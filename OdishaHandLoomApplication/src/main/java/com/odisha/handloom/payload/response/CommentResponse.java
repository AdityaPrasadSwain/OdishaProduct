package com.odisha.handloom.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private UUID id;
    private String content;
    private String user;
    private LocalDateTime createdAt;
    private boolean isSellerReply;
    private long likesCount;
    private boolean isLiked;
    private List<CommentResponse> replies;

    public void setId(UUID id) {
        this.id = id;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setSellerReply(boolean isSellerReply) {
        this.isSellerReply = isSellerReply;
    } // Using setSellerReply to match intent

    public void setLikesCount(long likesCount) {
        this.likesCount = likesCount;
    }

    public void setIsLiked(boolean isLiked) {
        this.isLiked = isLiked;
    }

    public void setReplies(List<CommentResponse> replies) {
        this.replies = replies;
    }

    public UUID getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public String getUser() {
        return user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isSellerReply() {
        return isSellerReply;
    }

    public long getLikesCount() {
        return likesCount;
    }

    public boolean isLiked() {
        return isLiked;
    } // Convention for boolean

    public List<CommentResponse> getReplies() {
        return replies;
    }
}
