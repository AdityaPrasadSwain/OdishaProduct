package com.odisha.handloom.logistics.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class SellerProofRequestDto {
    private UUID shipmentId;
    private UUID orderId;
    private String reason;
}
