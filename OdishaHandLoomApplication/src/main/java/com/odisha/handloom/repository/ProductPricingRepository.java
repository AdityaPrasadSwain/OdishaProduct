package com.odisha.handloom.repository;

import com.odisha.handloom.entity.ProductPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProductPricingRepository extends JpaRepository<ProductPricing, UUID> {
    java.util.Optional<ProductPricing> findByProductId(UUID productId);
}
