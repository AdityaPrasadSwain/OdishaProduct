package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "comment_likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "comment_id" })
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentLike {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    private ReelComment comment;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public void setComment(ReelComment comment) {
        this.comment = comment;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ReelComment getComment() {
        return comment;
    }

    public User getUser() {
        return user;
    }
}
