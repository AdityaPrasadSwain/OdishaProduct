package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.StockNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockNotificationRepository extends JpaRepository<StockNotification, UUID> {

    List<StockNotification> findByProductAndNotifiedFalse(Product product);

    boolean existsByProductAndCustomerEmailAndNotifiedFalse(Product product, String customerEmail);
}
