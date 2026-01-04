package com.odisha.handloom.logistics.repository;

import com.odisha.handloom.logistics.entity.DeliveryOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryOtpRepository extends JpaRepository<DeliveryOtp, UUID> {
    Optional<DeliveryOtp> findByOrderId(String orderId);
}
