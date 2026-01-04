package com.odisha.handloom.repository;

import com.odisha.handloom.entity.LocationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LocationHistoryRepository extends JpaRepository<LocationHistory, UUID> {
    List<LocationHistory> findByShipmentIdOrderByTimestampDesc(UUID shipmentId);
}
