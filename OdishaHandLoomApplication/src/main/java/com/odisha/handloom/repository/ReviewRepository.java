package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByProductIdOrderByCreatedAtDesc(UUID productId);

    @Query("SELECT r FROM Review r WHERE r.orderItem.id = :orderItemId")
    Optional<Review> findByOrderItemId(@Param("orderItemId") UUID orderItemId);

    boolean existsByOrderItemId(UUID orderItemId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") UUID productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    long getReviewCountByProductId(@Param("productId") UUID productId);
}
