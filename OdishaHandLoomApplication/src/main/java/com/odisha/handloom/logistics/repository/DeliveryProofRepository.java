package com.odisha.handloom.logistics.repository;

import com.odisha.handloom.logistics.entity.DeliveryProof;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryProofRepository extends JpaRepository<DeliveryProof, UUID> {
    Optional<DeliveryProof> findByShipmentId(UUID shipmentId);

    List<DeliveryProof> findByOrderId(UUID orderId);

    List<DeliveryProof> findByAgentId(UUID agentId);
}
