package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Payment;
import com.odisha.handloom.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    List<Payment> findBySellerId(UUID sellerId);

    List<Payment> findByUserId(UUID userId);

    @Query("SELECT p FROM Payment p WHERE p.seller.id = :sellerId AND p.status = :status")
    List<Payment> findBySellerAndStatus(@Param("sellerId") UUID sellerId, @Param("status") PaymentStatus status);

    Payment findByTransactionId(String transactionId);

    Payment findByOrderId(UUID orderId);
}
