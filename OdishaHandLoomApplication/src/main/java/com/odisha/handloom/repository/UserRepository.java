package com.odisha.handloom.repository;

import com.odisha.handloom.entity.RegistrationStatus;
import com.odisha.handloom.entity.Role;
import com.odisha.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);

    Boolean existsByEmail(String email);

    Boolean existsByPhoneNumber(String phoneNumber);

    Boolean existsByGstNumber(String gstNumber);

    java.util.List<User> findByRole(Role role);

    // Boolean field mappings (Rule: isActive -> IsActiveTrue/False)
    java.util.List<User> findByIsApprovedTrue();

    java.util.List<User> findByIsApprovedFalse();

    java.util.List<User> findByIsBlockedTrue();

    java.util.List<User> findByIsBlockedFalse();

    java.util.List<User> findByIsBankVerifiedTrue();

    java.util.List<User> findByIsBankVerifiedFalse();

    java.util.List<User> findByIsDeletedTrue();

    java.util.List<User> findByIsDeletedFalse();

    // Derived Queries based on exact field names
    java.util.List<User> findByFullNameContainingIgnoreCase(String fullName);

    java.util.List<User> findByRegistrationStatus(RegistrationStatus registrationStatus);

    Optional<User> findByShopName(String shopName);

    Optional<User> findByPanNumber(String panNumber);
}
