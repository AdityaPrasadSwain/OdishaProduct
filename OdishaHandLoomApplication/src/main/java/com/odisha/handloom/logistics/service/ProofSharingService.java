package com.odisha.handloom.logistics.service;

import com.odisha.handloom.enums.ProofRequestStatus;
import com.odisha.handloom.logistics.entity.DeliveryProof;
import com.odisha.handloom.logistics.entity.SellerProofRequest;
import com.odisha.handloom.logistics.repository.DeliveryProofRepository;
import com.odisha.handloom.logistics.repository.SellerProofRequestRepository;
import com.odisha.handloom.entity.Shipment;
import com.odisha.handloom.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProofSharingService {

    @Autowired
    private SellerProofRequestRepository requestRepository;

    @Autowired
    private DeliveryProofRepository proofRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    // --- SELLER ACTIONS ---

    @Transactional
    public SellerProofRequest requestProofAccess(UUID sellerId, UUID shipmentId, String reason) {
        // 1. Validate Shipment ownership
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .or(() -> shipmentRepository.findByOrder_Id(shipmentId))
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        // Ensure we use the actual shipment ID
        UUID resolvedShipmentId = shipment.getId();

        // Assuming Shipment -> OrderItem -> Product -> Seller (Simplified check,
        // assumes Order has Seller ID link if direct)
        // OR checks if ANY item in the order belongs to this seller.
        boolean isOwner = shipment.getOrder().getOrderItems().stream()
                .anyMatch(item -> item.getProduct().getSeller().getId().equals(sellerId));

        if (!isOwner) {
            throw new RuntimeException("Unauthorized: You do not own this shipment.");
        }

        if (requestRepository.existsBySellerIdAndShipmentId(sellerId, resolvedShipmentId)) {
            throw new RuntimeException("Request already exists.");
        }

        SellerProofRequest request = new SellerProofRequest();
        request.setSellerId(sellerId);
        request.setShipmentId(resolvedShipmentId);
        request.setOrderId(shipment.getOrder().getId()); // Set Order ID
        request.setReason(reason);
        request.setStatus(ProofRequestStatus.PENDING);

        return requestRepository.save(request);
    }

    @Transactional
    public SellerProofRequest requestProofAccessByOrder(UUID sellerId, UUID orderId, String reason) {
        Shipment shipment = shipmentRepository.findByOrder_Id(orderId)
                .orElseThrow(() -> new RuntimeException("Shipment not found for this Order ID"));

        return requestProofAccess(sellerId, shipment.getId(), reason);
    }

    public String getProofUrlForSeller(UUID sellerId, UUID shipmentId) {
        // Try finding by ID directly (it could be shipmentId OR orderId passed by
        // frontend)
        SellerProofRequest request = requestRepository.findBySellerIdAndShipmentId(sellerId, shipmentId)
                .or(() -> requestRepository.findBySellerIdAndOrderId(sellerId, shipmentId))
                .orElseThrow(() -> new RuntimeException("No access request found. Please request access first."));

        // Correct shipment ID logic for Proof Retrieval
        UUID actualShipmentId = request.getShipmentId();

        if (request.getStatus() != ProofRequestStatus.APPROVED) {
            throw new RuntimeException("Access request is " + request.getStatus() + ".");
        }

        DeliveryProof proof = proofRepository.findByShipmentId(actualShipmentId)
                .orElseThrow(() -> new RuntimeException("Proof not uploaded by agent yet."));

        return proof.getImageUrl();
    }

    public List<SellerProofRequest> getSellerRequests(UUID sellerId) {
        return requestRepository.findBySellerId(sellerId);
    }

    // --- ADMIN ACTIONS ---

    public List<SellerProofRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<SellerProofRequest> getPendingRequests() {
        return requestRepository.findByStatus(ProofRequestStatus.PENDING);
    }

    public List<DeliveryProof> getAllProofs() {
        return proofRepository.findAll();
    }

    public Optional<DeliveryProof> getAdminProof(UUID shipmentId) {
        return proofRepository.findByShipmentId(shipmentId);
    }

    @Transactional
    public DeliveryProof uploadProofAsAdmin(UUID shipmentId, String imageUrl) {
        // Reuse same logic or simplified
        DeliveryProof proof = proofRepository.findByShipmentId(shipmentId)
                .orElse(new DeliveryProof());
        proof.setShipmentId(shipmentId);
        proof.setImageUrl(imageUrl);
        proof.setUploadedAt(LocalDateTime.now());
        // We don't have 'uploadedBy' as User in Entity? Let's check.
        // For now, simple save.
        return proofRepository.save(proof);
    }

    @Transactional
    public SellerProofRequest processRequest(UUID requestId, ProofRequestStatus status, String comment) {
        SellerProofRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(status);
        request.setAdminComment(comment);
        request.setProcessedAt(LocalDateTime.now());

        return requestRepository.save(request);
    }

    // --- AGENT ACTIONS ---

    public List<DeliveryProof> getAgentProofs(UUID agentId) {
        return proofRepository.findByAgentId(agentId);
    }
    // --- SELLER ACTIONS (Continued) ---

    public List<com.odisha.handloom.logistics.dto.SellerApprovedProofDto> getApprovedProofsForSeller(UUID sellerId) {
        List<SellerProofRequest> approvedRequests = requestRepository.findBySellerIdAndStatus(sellerId,
                ProofRequestStatus.APPROVED);

        return approvedRequests.stream().map(request -> {
            Optional<DeliveryProof> proofOpt = proofRepository.findByShipmentId(request.getShipmentId());
            if (proofOpt.isEmpty())
                return null;

            DeliveryProof proof = proofOpt.get();
            com.odisha.handloom.logistics.dto.SellerApprovedProofDto dto = new com.odisha.handloom.logistics.dto.SellerApprovedProofDto();
            dto.setId(proof.getId());
            dto.setSellerId(sellerId);
            dto.setOrderId(proof.getOrderId());
            dto.setShipmentId(proof.getShipmentId());
            dto.setProofUrl(proof.getImageUrl());
            dto.setStatus("APPROVED");
            dto.setRemarks(proof.getRemarks());
            dto.setUploadDate(proof.getUploadedAt());
            return dto;
        }).filter(java.util.Objects::nonNull).collect(java.util.stream.Collectors.toList());
    }
}
