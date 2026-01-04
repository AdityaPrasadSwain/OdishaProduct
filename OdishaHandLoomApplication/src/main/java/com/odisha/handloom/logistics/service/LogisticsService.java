package com.odisha.handloom.logistics.service;

import com.odisha.handloom.logistics.entity.AgentEarning;
import com.odisha.handloom.logistics.entity.ShipmentPayment;

import java.util.List;
import java.util.UUID;

public interface LogisticsService {

    // Payment
    String generatePaymentQr(UUID shipmentId, UUID agentId);

    ShipmentPayment recordPaymentSuccess(UUID shipmentId, UUID agentId, String transactionRef);

    // Earnings
    AgentEarning calculateAndRecordEarning(UUID shipmentId, UUID agentId, double distanceKm);

    List<AgentEarning> getAgentEarnings(UUID agentId);

    // Returns / Failures
    void markDeliveryFailed(UUID shipmentId, UUID agentId, String reason);

    // Location
    com.odisha.handloom.entity.Shipment getShipmentLocation(UUID shipmentId);

    // Dashboard
    List<com.odisha.handloom.logistics.dto.AgentOrderDTO> getAgentOrders(UUID agentId);

    com.odisha.handloom.logistics.dto.AgentSummaryDTO getAgentSummary(UUID agentId);

    // Assignment & Dispatch
    void assignAgent(UUID shipmentId, UUID agentId);

    void dispatchShipment(UUID shipmentId);

    // Proof of Delivery
    com.odisha.handloom.logistics.entity.DeliveryProof uploadProof(UUID shipmentId, UUID agentId,
            org.springframework.web.multipart.MultipartFile file);

    com.odisha.handloom.logistics.entity.DeliveryProof uploadProofByOrder(UUID orderId, UUID agentId, String remarks,
            org.springframework.web.multipart.MultipartFile file);
}
