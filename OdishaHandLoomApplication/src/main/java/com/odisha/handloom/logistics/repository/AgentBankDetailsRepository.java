package com.odisha.handloom.logistics.repository;

import com.odisha.handloom.logistics.entity.AgentBankDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AgentBankDetailsRepository extends JpaRepository<AgentBankDetails, UUID> {
    Optional<AgentBankDetails> findByAgentId(UUID agentId);
}
