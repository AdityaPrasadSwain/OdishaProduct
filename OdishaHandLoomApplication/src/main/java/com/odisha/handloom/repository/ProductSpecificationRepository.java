package com.odisha.handloom.repository;

import com.odisha.handloom.entity.ProductSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, UUID> {
    List<ProductSpecification> findByProductId(UUID productId);

    void deleteByProductId(UUID productId);
}
