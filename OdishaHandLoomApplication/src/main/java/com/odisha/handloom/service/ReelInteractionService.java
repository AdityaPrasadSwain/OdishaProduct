package com.odisha.handloom.service;

import com.odisha.handloom.entity.CommentLike;
import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.ReelComment;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.request.ReplyCommentRequest;
import com.odisha.handloom.payload.response.CommentLikeResponse;
import com.odisha.handloom.payload.response.CommentResponse;
import com.odisha.handloom.repository.CommentLikeRepository;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.ReelCommentRepository;
import com.odisha.handloom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReelInteractionService {

        private final ProductRepository productRepository;
        private final ReelCommentRepository reelCommentRepository;
        private final UserRepository userRepository;
        private final NotificationService notificationService;
        private final CommentLikeRepository commentLikeRepository;

        @Transactional(readOnly = true)
        public List<CommentResponse> getCommentsForReel(UUID reelId, String userEmail) {
                Product reel = productRepository.findById(reelId)
                                .orElseThrow(() -> new RuntimeException("Reel not found"));

                User user = null;
                if (userEmail != null) {
                        user = userRepository.findByEmail(userEmail).orElse(null);
                }
                final User currentUser = user;

                // Fetch top-level comments
                return reelCommentRepository.findByReelOrderByCreatedAtDesc(reel).stream()
                                .filter(c -> c.getParent() == null)
                                .map(c -> mapToCommentResponse(c, currentUser))
                                .collect(Collectors.toList());
        }

        @Transactional
        public CommentResponse addComment(UUID reelId, ReplyCommentRequest request, String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Product reel = productRepository.findById(reelId)
                                .orElseThrow(() -> new RuntimeException("Reel not found"));

                ReelComment comment = new ReelComment();
                comment.setReel(reel);
                comment.setUser(user);
                comment.setContent(request.getComment());
                comment.setParent(null);
                comment.setSellerResponse(false);
                // comment.setReplies(new ArrayList<>()); // Initialize in getter or constructor
                // if possible

                if (user.getId().equals(reel.getSeller().getId())) {
                        comment.setSellerReply(true);
                }

                ReelComment saved = reelCommentRepository.save(comment);
                return mapToCommentResponse(saved, user);
        }

        @Transactional
        public CommentResponse replyToComment(UUID reelId, UUID parentCommentId, ReplyCommentRequest request,
                        String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Product reel = productRepository.findById(reelId)
                                .orElseThrow(() -> new RuntimeException("Reel not found"));
                ReelComment parent = reelCommentRepository.findById(parentCommentId)
                                .orElseThrow(() -> new RuntimeException("Parent comment not found"));

                if (!parent.getReel().getId().equals(reelId)) {
                        throw new RuntimeException("Comment does not belong to this reel");
                }

                ReelComment reply = new ReelComment();
                reply.setReel(reel);
                reply.setUser(user);
                reply.setContent(request.getComment());
                reply.setParent(parent);
                reply.setSellerResponse(false);
                // reply.setReplies(new ArrayList<>());

                if (user.getId().equals(reel.getSeller().getId())) {
                        reply.setSellerReply(true);
                }

                ReelComment saved = reelCommentRepository.save(reply);

                // TRIGGER NOTIFICATION
                notificationService.createReplyNotification(parent.getUser(), user, reelId, reply.getId());

                // Return the PARENT's response so frontend can update the whole thread,
                // OR return the child response. Returning child is standard for POST.
                return mapToCommentResponse(saved, user);
        }

        public long getReelCommentCount(Product reel) {
                return reelCommentRepository.countByReel(reel);
        }

        @Transactional
        public CommentLikeResponse toggleCommentLike(UUID commentId, String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                ReelComment comment = reelCommentRepository.findById(commentId)
                                .orElseThrow(() -> new RuntimeException("Comment not found"));

                Optional<CommentLike> existingLike = commentLikeRepository.findByCommentAndUser(comment, user);
                boolean isLiked;

                if (existingLike.isPresent()) {
                        commentLikeRepository.delete(existingLike.get());
                        isLiked = false;
                } else {
                        CommentLike like = new CommentLike();
                        like.setComment(comment);
                        like.setUser(user);
                        commentLikeRepository.save(like);
                        isLiked = true;

                        // BONUS: Notify comment owner
                        notificationService.createNotification(comment.getUser(), "Comment Liked",
                                        user.getFullName() + " liked your comment");
                }

                long count = commentLikeRepository.countByComment(comment);

                CommentLikeResponse response = new CommentLikeResponse();
                response.setCommentId(commentId);
                response.setLikesCount(count);
                response.setIsLiked(isLiked);
                return response;
        }

        private CommentResponse mapToCommentResponse(ReelComment c, User currentUser) {
                long likesCount = commentLikeRepository.countByComment(c);
                boolean isLiked = currentUser != null && commentLikeRepository.existsByCommentAndUser(c, currentUser);

                CommentResponse response = new CommentResponse();
                response.setId(c.getId());
                response.setContent(c.getContent());
                response.setUser(c.getUser().getFullName());
                response.setCreatedAt(c.getCreatedAt());
                response.setSellerReply(c.isSellerReply());
                response.setLikesCount(likesCount);
                response.setIsLiked(isLiked);
                response.setReplies(c.getReplies() != null
                                ? c.getReplies().stream().map(r -> mapToCommentResponse(r, currentUser))
                                                .collect(Collectors.toList())
                                : new ArrayList<>());
                return response;
        }
}
