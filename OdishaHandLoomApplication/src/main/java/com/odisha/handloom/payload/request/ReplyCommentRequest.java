package com.odisha.handloom.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class ReplyCommentRequest {
    @NotBlank(message = "Comment cannot be empty")
    private String comment;

    // Optional: if parentId is passed in body instead of path, but path is
    // preferred for REST
    private UUID parentId;
}
