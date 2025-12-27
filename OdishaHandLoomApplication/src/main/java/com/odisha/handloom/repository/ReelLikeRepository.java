package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.ReelLike;
import com.odisha.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ReelLikeRepository extends JpaRepository<ReelLike, UUID> {
    Optional<ReelLike> findByReelAndUser(Product reel, User user);

    long countByReel(Product reel);

    boolean existsByReelAndUser(Product reel, User user);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(l) FROM ReelLike l WHERE l.reel.seller.id = :sellerId")
    long countAllLikesBySeller(@org.springframework.data.repository.query.Param("sellerId") java.util.UUID sellerId);
}
