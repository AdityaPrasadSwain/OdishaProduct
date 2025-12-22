package com.odisha.handloom.payload.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class NotificationResponse {
    private UUID id;
    private String message;
    private String type; // String to be safe for frontend
    private boolean isRead;
    private String senderName; // "System" if null
    private LocalDateTime createdAt;
    private UUID orderId;
    private UUID reelId;
    private UUID commentId;
}
