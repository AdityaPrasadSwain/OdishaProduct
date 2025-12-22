package com.odisha.handloom.repository;

import com.odisha.handloom.entity.SellerFollower;
import com.odisha.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SellerFollowerRepository extends JpaRepository<SellerFollower, UUID> {
    Optional<SellerFollower> findBySellerAndUser(User seller, User user);

    long countBySeller(User seller);

    boolean existsBySellerAndUser(User seller, User user);
}
