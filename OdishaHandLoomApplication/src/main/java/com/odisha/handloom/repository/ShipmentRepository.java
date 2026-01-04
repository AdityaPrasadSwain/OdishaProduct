package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Shipment;
import com.odisha.handloom.enums.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, UUID> {
    Optional<Shipment> findByOrder_Id(UUID orderId);

    @Query("SELECT s FROM Shipment s WHERE s.order.id = :orderId")
    Optional<Shipment> findByOrderId(@Param("orderId") UUID orderId);

    List<Shipment> findByAgentId(UUID agentId);

    long countByAgentId(UUID agentId);

    long countByAgentIdAndStatus(UUID agentId, ShipmentStatus status);

    List<Shipment> findByStatus(ShipmentStatus status);
}
