package com.odisha.handloom.service;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.ReelComment;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.response.SellerCommentAnalyticsResponse;
import com.odisha.handloom.repository.CommentLikeRepository;
import com.odisha.handloom.repository.ReelCommentRepository;
import com.odisha.handloom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SellerAnalyticsService {

    private final ReelCommentRepository reelCommentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public SellerCommentAnalyticsResponse getCommentAnalytics(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        UUID sellerId = seller.getId();

        // 1. Total Comments
        long totalComments = reelCommentRepository.countAllCommentsBySeller(sellerId);

        // 2. Total Replies
        long totalReplies = reelCommentRepository.countRepliesBySeller(sellerId);

        // 3. Total Comment Likes
        long totalLikes = commentLikeRepository.countTotalLikesBySeller(sellerId);

        // 4. Top Reel
        SellerCommentAnalyticsResponse.TopReelStats topReelStats = null;
        List<Object[]> topReelResults = reelCommentRepository.findTopCommentedReel(sellerId, PageRequest.of(0, 1));
        if (!topReelResults.isEmpty()) {
            Object[] row = topReelResults.get(0);
            Product reel = (Product) row[0];
            Long count = (Long) row[1];
            topReelStats = SellerCommentAnalyticsResponse.TopReelStats.builder()
                    .reelId(reel.getId())
                    .caption(reel.getReelCaption())
                    .commentsCount(count)
                    .build();
        }

        // 5. Most Liked Comment
        SellerCommentAnalyticsResponse.MostLikedCommentStats topCommentStats = null;
        List<Object[]> topCommentResults = commentLikeRepository.findMostLikedComment(sellerId, PageRequest.of(0, 1));
        if (!topCommentResults.isEmpty()) {
            Object[] row = topCommentResults.get(0);
            ReelComment comment = (ReelComment) row[0];
            Long count = (Long) row[1];
            topCommentStats = SellerCommentAnalyticsResponse.MostLikedCommentStats.builder()
                    .commentId(comment.getId())
                    .content(comment.getContent())
                    .userName(comment.getUser().getFullName())
                    .likesCount(count)
                    .build();
        }

        return SellerCommentAnalyticsResponse.builder()
                .totalComments(totalComments)
                .totalReplies(totalReplies)
                .totalCommentLikes(totalLikes)
                .topReel(topReelStats)
                .mostLikedComment(topCommentStats)
                .build();
    }
}
