package com.odisha.handloom.repository;

import com.odisha.handloom.entity.PlatformConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatformConfigRepository extends JpaRepository<PlatformConfig, String> {
}
