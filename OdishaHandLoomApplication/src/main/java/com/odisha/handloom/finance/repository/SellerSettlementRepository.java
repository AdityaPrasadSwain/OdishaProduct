package com.odisha.handloom.finance.repository;

import com.odisha.handloom.finance.entity.SellerSettlement;
import com.odisha.handloom.finance.enums.SettlementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SellerSettlementRepository extends JpaRepository<SellerSettlement, UUID> {
    List<SellerSettlement> findBySellerId(UUID sellerId);

    List<SellerSettlement> findByStatus(SettlementStatus status);
}
