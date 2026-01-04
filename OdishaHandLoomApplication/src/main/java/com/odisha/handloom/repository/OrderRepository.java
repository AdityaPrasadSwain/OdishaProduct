package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
        List<Order> findByUserId(UUID userId);

        List<Order> findBySellerId(UUID sellerId);

        List<Order> findByUserIdAndCreatedAtAfter(UUID userId, java.time.LocalDateTime date);

        @org.springframework.data.jpa.repository.Query("SELECT o FROM Order o WHERE o.user.id = :userId " +
                        "AND (cast(:startDate as timestamp) IS NULL OR o.createdAt >= :startDate) " +
                        "AND (cast(:endDate as timestamp) IS NULL OR o.createdAt <= :endDate) " +
                        "ORDER BY o.createdAt DESC")
        List<Order> findOrdersByFilters(
                        @org.springframework.data.repository.query.Param("userId") UUID userId,
                        @org.springframework.data.repository.query.Param("status") com.odisha.handloom.entity.OrderStatus status,
                        @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
                        @org.springframework.data.repository.query.Param("endDate") java.time.LocalDateTime endDate);
}
