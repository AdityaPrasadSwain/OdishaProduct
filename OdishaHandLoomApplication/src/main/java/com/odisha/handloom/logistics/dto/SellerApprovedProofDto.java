package com.odisha.handloom.logistics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SellerApprovedProofDto {
    private UUID id;
    private UUID sellerId;
    private UUID orderId;
    private UUID shipmentId;
    private String proofUrl;
    private String status;
    private String remarks;
    private LocalDateTime uploadDate;
}
