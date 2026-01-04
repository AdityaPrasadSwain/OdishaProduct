package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Table(name = "reel_comments")
@jakarta.persistence.Entity
@lombok.Getter
@lombok.Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReelComment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reel_id", nullable = false)
    private Product reel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 1000)
    private String content;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ReelComment parent;

    @Builder.Default
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private java.util.List<ReelComment> replies = new java.util.ArrayList<>();

    @Builder.Default
    @Column(name = "seller_response", columnDefinition = "boolean default false")
    private Boolean sellerResponse = false;

    // Helper methods for backward compatibility or ease of use
    public boolean isSellerReply() {
        return Boolean.TRUE.equals(this.sellerResponse);
    }

    public void setSellerReply(boolean isSellerReply) {
        this.sellerResponse = isSellerReply;
    }

    // NULL-SAFETY: Override getter to ensure replies is never null
    public java.util.List<ReelComment> getReplies() {
        if (this.replies == null) {
            this.replies = new java.util.ArrayList<>();
        }
        return this.replies;
    }

    public UUID getId() {
        return id;
    }

    public Product getReel() {
        return reel;
    }

    public User getUser() {
        return user;
    }

    public void setParent(ReelComment parent) {
        this.parent = parent;
    }

    public ReelComment getParent() {
        return parent;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setReel(Product reel) {
        this.reel = reel;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setSellerResponse(boolean sellerResponse) {
        this.sellerResponse = sellerResponse;
    }

    public void setReplies(java.util.List<ReelComment> replies) {
        this.replies = replies;
    }
}
