package com.odisha.handloom.repository;

import com.odisha.handloom.entity.CommentLike;
import com.odisha.handloom.entity.ReelComment;
import com.odisha.handloom.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommentLikeRepository extends JpaRepository<CommentLike, UUID> {
    long countByComment(ReelComment comment);

    boolean existsByCommentAndUser(ReelComment comment, User user);

    Optional<CommentLike> findByCommentAndUser(ReelComment comment, User user);

    // --- ANALYTICS QUERIES ---

    // Count total likes on comments belonging to seller's reels
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.comment.reel.seller.id = :sellerId")
    long countTotalLikesBySeller(@Param("sellerId") UUID sellerId);

    // Find most liked comment on seller's reels
    // Returns Object[]: [ReelComment comment, Long count]
    @Query("SELECT cl.comment, COUNT(cl) as cnt FROM CommentLike cl WHERE cl.comment.reel.seller.id = :sellerId GROUP BY cl.comment ORDER BY cnt DESC")
    List<Object[]> findMostLikedComment(@Param("sellerId") UUID sellerId, Pageable pageable);
}
