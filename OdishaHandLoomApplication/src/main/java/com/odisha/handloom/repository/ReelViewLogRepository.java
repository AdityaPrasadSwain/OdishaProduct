package com.odisha.handloom.repository;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.ReelViewLog;
import com.odisha.handloom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReelViewLogRepository extends JpaRepository<ReelViewLog, UUID> {

    // Check if user has viewed reel
    boolean existsByReelAndViewer(Product reel, User viewer);

    // Check if anonymous session has viewed reel
    boolean existsByReelAndSessionId(Product reel, String sessionId);
}
