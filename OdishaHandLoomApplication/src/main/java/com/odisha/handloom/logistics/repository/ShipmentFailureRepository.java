package com.odisha.handloom.logistics.repository;

import com.odisha.handloom.logistics.entity.ShipmentFailure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ShipmentFailureRepository extends JpaRepository<ShipmentFailure, UUID> {
    List<ShipmentFailure> findByShipmentId(UUID shipmentId);
}
