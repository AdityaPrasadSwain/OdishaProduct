package com.odisha.handloom.repository;

import com.odisha.handloom.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    boolean existsByProduct_Id(UUID productId);
}
