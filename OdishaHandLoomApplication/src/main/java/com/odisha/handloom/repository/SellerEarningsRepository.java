package com.odisha.handloom.repository;

import com.odisha.handloom.entity.SellerEarnings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SellerEarningsRepository extends JpaRepository<SellerEarnings, UUID> {
    List<SellerEarnings> findBySeller_Id(UUID sellerId);

    List<SellerEarnings> findByPayoutStatus(SellerEarnings.PayoutStatus status);
}
