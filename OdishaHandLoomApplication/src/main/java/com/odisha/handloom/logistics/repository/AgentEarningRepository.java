package com.odisha.handloom.logistics.repository;

import com.odisha.handloom.logistics.entity.AgentEarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AgentEarningRepository extends JpaRepository<AgentEarning, UUID> {
    List<AgentEarning> findByAgentId(UUID agentId);

    List<AgentEarning> findByStatus(AgentEarning.EarningStatus status);

    Optional<AgentEarning> findByShipmentId(UUID shipmentId);

    @Query("SELECT SUM(e.amount) FROM AgentEarning e WHERE e.agentId = :agentId")
    BigDecimal sumAmountByAgentId(@Param("agentId") UUID agentId);

    @Query("SELECT SUM(e.amount) FROM AgentEarning e WHERE e.agentId = :agentId AND e.createdAt >= :date")
    BigDecimal sumAmountByAgentIdSince(@Param("agentId") UUID agentId, @Param("date") LocalDateTime date);
}
