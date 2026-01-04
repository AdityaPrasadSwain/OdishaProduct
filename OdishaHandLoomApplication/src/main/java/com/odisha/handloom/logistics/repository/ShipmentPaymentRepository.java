package com.odisha.handloom.logistics.repository;

import com.odisha.handloom.logistics.entity.ShipmentPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ShipmentPaymentRepository extends JpaRepository<ShipmentPayment, UUID> {
    List<ShipmentPayment> findByShipmentId(UUID shipmentId);

    List<ShipmentPayment> findByAgentId(UUID agentId);
}
