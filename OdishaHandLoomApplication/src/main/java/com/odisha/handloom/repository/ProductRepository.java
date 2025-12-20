package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findBySellerId(UUID sellerId);

    List<Product> findByCategory_Id(UUID categoryId);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByIsApprovedTrue(); // Only show approved products to customers
}
