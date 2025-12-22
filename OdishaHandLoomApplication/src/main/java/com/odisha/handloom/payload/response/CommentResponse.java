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
}
