package com.odisha.handloom.repository;

import com.odisha.handloom.entity.ReturnStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReturnStatusLogRepository extends JpaRepository<ReturnStatusLog, UUID> {
}
