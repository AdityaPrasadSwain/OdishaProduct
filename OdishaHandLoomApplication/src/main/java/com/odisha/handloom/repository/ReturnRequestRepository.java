package com.odisha.handloom.repository;

import com.odisha.handloom.entity.ReturnRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, UUID> {
    List<ReturnRequest> findBySellerId(UUID sellerId);

    List<ReturnRequest> findByCustomerId(UUID customerId);

    boolean existsByOrderItemId(UUID orderItemId);
}
