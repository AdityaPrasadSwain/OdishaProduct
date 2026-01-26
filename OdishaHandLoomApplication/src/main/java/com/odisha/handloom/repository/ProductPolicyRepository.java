package com.odisha.handloom.repository;

import com.odisha.handloom.entity.ProductPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProductPolicyRepository extends JpaRepository<ProductPolicy, UUID> {
    java.util.Optional<ProductPolicy> findByProduct_Id(UUID productId);
}
