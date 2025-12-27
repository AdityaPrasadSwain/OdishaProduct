package com.odisha.handloom.service;

import com.odisha.handloom.entity.*;
import com.odisha.handloom.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SellerAnalyticsService {

    private final ReelAnalyticsRepository reelAnalyticsRepository;
    private final ReelViewLogRepository reelViewLogRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public void recordView(UUID reelId, String email, String sessionId) {
        Product reel = productRepository.findById(reelId)
                .orElseThrow(() -> new RuntimeException("Reel not found"));

        ReelAnalytics analytics = reelAnalyticsRepository.findByReel(reel)
                .orElseGet(() -> {
                    ReelAnalytics ra = new ReelAnalytics();
                    ra.setReel(reel);
                    return reelAnalyticsRepository.save(ra);
                });

        // Increment Views (always)
        analytics.setTotalViews(analytics.getTotalViews() + 1);

        // Check Reach (Distinct Viewer)
        boolean isNewViewer = false;
        User viewer = null;

        if (email != null) {
            viewer = userRepository.findByEmail(email).orElse(null);
            if (viewer != null && !reelViewLogRepository.existsByReelAndViewer(reel, viewer)) {
                isNewViewer = true;
            }
        } else if (sessionId != null) {
            if (!reelViewLogRepository.existsByReelAndSessionId(reel, sessionId)) {
                isNewViewer = true;
            }
        }

        if (isNewViewer) {
            analytics.setTotalReach(analytics.getTotalReach() + 1);

            ReelViewLog log = new ReelViewLog();
            log.setReel(reel);
            log.setViewer(viewer);
            log.setSessionId(sessionId);
            reelViewLogRepository.save(log);
        }

        reelAnalyticsRepository.save(analytics);
    }

    // Called when a like happens
    @Transactional
    public void updateLikeCount(Product reel, long delta) {
        ReelAnalytics analytics = reelAnalyticsRepository.findByReel(reel)
                .orElseGet(() -> {
                    ReelAnalytics ra = new ReelAnalytics();
                    ra.setReel(reel);
                    return reelAnalyticsRepository.save(ra);
                });

        long newLikes = analytics.getTotalLikes() + delta;
        if (newLikes < 0)
            newLikes = 0;
        analytics.setTotalLikes(newLikes);
        reelAnalyticsRepository.save(analytics);
    }
}
