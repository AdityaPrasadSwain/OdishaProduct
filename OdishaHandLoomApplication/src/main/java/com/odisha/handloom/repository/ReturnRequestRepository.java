package com.odisha.handloom.repository;

import com.odisha.handloom.entity.ReturnRequest;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.enums.ReturnStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, UUID> {
    List<ReturnRequest> findByCustomer(User customer);

    List<ReturnRequest> findBySeller(User seller);

    List<ReturnRequest> findByStatus(ReturnStatus status);

    boolean existsByOrderItemId(UUID orderItemId);
}
