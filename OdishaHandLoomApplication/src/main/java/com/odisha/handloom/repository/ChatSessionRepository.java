package com.odisha.handloom.repository;

import com.odisha.handloom.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {
    Optional<ChatSession> findByUserIdAndIsActiveTrue(UUID userId);
}
