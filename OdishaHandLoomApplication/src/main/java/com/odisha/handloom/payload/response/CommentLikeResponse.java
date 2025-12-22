package com.odisha.handloom.payload.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CommentLikeResponse {
    private UUID commentId;
    private long likesCount;
    private boolean isLiked;
}
