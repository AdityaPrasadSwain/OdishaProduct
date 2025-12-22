package com.odisha.handloom.repository;

import com.odisha.handloom.entity.SellerKyc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SellerKycRepository extends JpaRepository<SellerKyc, UUID> {
    Optional<SellerKyc> findByUserId(UUID userId);
}
