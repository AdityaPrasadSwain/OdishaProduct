package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.ReelComment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ReelCommentRepository extends JpaRepository<ReelComment, UUID> {
    List<ReelComment> findByReelOrderByCreatedAtDesc(Product reel);

    long countByReel(Product reel);

    // --- ANALYTICS QUERIES ---

    // Count ALL comments (parent + replies) on reels owned by seller
    @Query("SELECT COUNT(c) FROM ReelComment c WHERE c.reel.seller.id = :sellerId")
    long countAllCommentsBySeller(@Param("sellerId") UUID sellerId);

    // Count only REPLIES on reels owned by seller (where parent is not null)
    @Query("SELECT COUNT(c) FROM ReelComment c WHERE c.reel.seller.id = :sellerId AND c.parent IS NOT NULL")
    long countRepliesBySeller(@Param("sellerId") UUID sellerId);

    // Find top reel by comment count
    // Returns Object[]: [Product reel, Long count]
    @Query("SELECT c.reel, COUNT(c) as cnt FROM ReelComment c WHERE c.reel.seller.id = :sellerId GROUP BY c.reel ORDER BY cnt DESC")
    List<Object[]> findTopCommentedReel(@Param("sellerId") UUID sellerId, Pageable pageable);
}
