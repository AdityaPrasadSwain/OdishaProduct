package com.odisha.handloom.repository;

import com.odisha.handloom.entity.SellerDocuments;
import com.odisha.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SellerDocumentsRepository extends JpaRepository<SellerDocuments, UUID> {
    Optional<SellerDocuments> findBySeller(User seller);

    boolean existsByPanNumber(String panNumber);

    boolean existsByAadhaarNumber(String aadhaarNumber);

    boolean existsByGstNumber(String gstNumber);
}
