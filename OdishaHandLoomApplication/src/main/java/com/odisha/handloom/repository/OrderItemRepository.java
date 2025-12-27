package com.odisha.handloom.repository;

import com.odisha.handloom.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
        boolean existsByProduct_Id(UUID productId);

        @org.springframework.data.jpa.repository.Query("SELECT oi FROM OrderItem oi " +
                        "JOIN oi.order o " +
                        "WHERE o.user.id = :customerId " +
                        "AND oi.product.id = :productId " +
                        "AND o.status = com.odisha.handloom.entity.OrderStatus.DELIVERED")
        java.util.List<OrderItem> findDeliveredItemsByCustomerAndProduct(
                        @org.springframework.data.repository.query.Param("customerId") UUID customerId,
                        @org.springframework.data.repository.query.Param("productId") UUID productId);

        @org.springframework.data.jpa.repository.Query("SELECT SUM(oi.quantity) FROM OrderItem oi " +
                        "JOIN oi.order o " +
                        "WHERE oi.product.id = :productId " +
                        "AND o.status <> com.odisha.handloom.entity.OrderStatus.CANCELLED")
        Integer sumQuantityByProduct(@org.springframework.data.repository.query.Param("productId") UUID productId);
}
