package com.odisha.handloom.repository;

import com.odisha.handloom.entity.SellerBankDetails;
import com.odisha.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SellerBankDetailsRepository extends JpaRepository<SellerBankDetails, UUID> {
    Optional<SellerBankDetails> findBySeller(User seller);

    boolean existsByAccountNumber(String accountNumber);
}
