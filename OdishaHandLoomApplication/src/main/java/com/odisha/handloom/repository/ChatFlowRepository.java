package com.odisha.handloom.repository;

import com.odisha.handloom.entity.ChatFlow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatFlowRepository extends JpaRepository<ChatFlow, UUID> {
    Optional<ChatFlow> findByIntentAndStepId(String intent, String stepId);
}
