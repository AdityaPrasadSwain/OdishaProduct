package com.odisha.handloom.entity;

import com.odisha.handloom.enums.ReturnReason;
import com.odisha.handloom.enums.ReturnStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "return_requests")
public class ReturnRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnReason reason;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl; // Comma separated if multiple or single URL
    private String proofImageUrl; // For checking damage proof

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnStatus status;

    private String sellerRemarks;
    private String adminComment;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @OneToOne(optional = false)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public ReturnRequest() {
    }

    public ReturnRequest(UUID id, ReturnReason reason, String description, String imageUrl, String proofImageUrl,
            ReturnStatus status, String sellerRemarks, String adminComment, Order order, OrderItem orderItem,
            User seller, User customer, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.reason = reason;
        this.description = description;
        this.imageUrl = imageUrl;
        this.proofImageUrl = proofImageUrl;
        this.status = status;
        this.sellerRemarks = sellerRemarks;
        this.adminComment = adminComment;
        this.order = order;
        this.orderItem = orderItem;
        this.seller = seller;
        this.customer = customer;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ReturnRequestBuilder builder() {
        return new ReturnRequestBuilder();
    }

    public static class ReturnRequestBuilder {
        private UUID id;
        private ReturnReason reason;
        private String description;
        private String imageUrl;
        private String proofImageUrl;
        private ReturnStatus status;
        private String sellerRemarks;
        private String adminComment;
        private Order order;
        private OrderItem orderItem;
        private User seller;
        private User customer;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        ReturnRequestBuilder() {
        }

        public ReturnRequestBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public ReturnRequestBuilder reason(ReturnReason reason) {
            this.reason = reason;
            return this;
        }

        public ReturnRequestBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ReturnRequestBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public ReturnRequestBuilder proofImageUrl(String proofImageUrl) {
            this.proofImageUrl = proofImageUrl;
            return this;
        }

        public ReturnRequestBuilder status(ReturnStatus status) {
            this.status = status;
            return this;
        }

        public ReturnRequestBuilder sellerRemarks(String sellerRemarks) {
            this.sellerRemarks = sellerRemarks;
            return this;
        }

        public ReturnRequestBuilder adminComment(String adminComment) {
            this.adminComment = adminComment;
            return this;
        }

        public ReturnRequestBuilder order(Order order) {
            this.order = order;
            return this;
        }

        public ReturnRequestBuilder orderItem(OrderItem orderItem) {
            this.orderItem = orderItem;
            return this;
        }

        public ReturnRequestBuilder seller(User seller) {
            this.seller = seller;
            return this;
        }

        public ReturnRequestBuilder customer(User customer) {
            this.customer = customer;
            return this;
        }

        public ReturnRequestBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ReturnRequestBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public ReturnRequest build() {
            return new ReturnRequest(id, reason, description, imageUrl, proofImageUrl, status, sellerRemarks,
                    adminComment, order, orderItem, seller, customer, createdAt, updatedAt);
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ReturnReason getReason() {
        return reason;
    }

    public void setReason(ReturnReason reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getProofImageUrl() {
        return proofImageUrl;
    }

    public void setProofImageUrl(String proofImageUrl) {
        this.proofImageUrl = proofImageUrl;
    }

    public ReturnStatus getStatus() {
        return status;
    }

    public void setStatus(ReturnStatus status) {
        this.status = status;
    }

    public String getSellerRemarks() {
        return sellerRemarks;
    }

    public void setSellerRemarks(String sellerRemarks) {
        this.sellerRemarks = sellerRemarks;
    }

    public String getAdminComment() {
        return adminComment;
    }

    public void setAdminComment(String adminComment) {
        this.adminComment = adminComment;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public OrderItem getOrderItem() {
        return orderItem;
    }

    public void setOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
