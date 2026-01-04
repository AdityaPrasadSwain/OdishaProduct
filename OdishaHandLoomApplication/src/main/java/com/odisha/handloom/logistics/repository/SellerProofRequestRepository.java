package com.odisha.handloom.logistics.repository;

import com.odisha.handloom.enums.ProofRequestStatus;
import com.odisha.handloom.logistics.entity.SellerProofRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SellerProofRequestRepository extends JpaRepository<SellerProofRequest, UUID> {

    // Check if seller already requested for this shipment
    boolean existsBySellerIdAndShipmentId(UUID sellerId, UUID shipmentId);

    // Get status for a specific request
    // Get status for a specific request
    Optional<SellerProofRequest> findBySellerIdAndShipmentId(UUID sellerId, UUID shipmentId);

    Optional<SellerProofRequest> findBySellerIdAndOrderId(UUID sellerId, UUID orderId);

    // Admin list: by status
    List<SellerProofRequest> findByStatus(ProofRequestStatus status);

    // List all requests for a seller
    List<SellerProofRequest> findBySellerId(UUID sellerId);

    List<SellerProofRequest> findBySellerIdAndStatus(UUID sellerId, ProofRequestStatus status);
}
