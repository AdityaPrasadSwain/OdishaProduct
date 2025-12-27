package com.odisha.handloom.repository;

import com.odisha.handloom.entity.SellerNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SellerNoteRepository extends JpaRepository<SellerNote, UUID> {
    List<SellerNote> findBySellerIdOrderByCreatedAtDesc(UUID sellerId);
}
