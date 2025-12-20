package com.odisha.handloom.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    private BigDecimal totalAmount;

    public Cart() {
    }

    public Cart(UUID id, User user, List<CartItem> items, BigDecimal totalAmount) {
        this.id = id;
        this.user = user;
        this.items = items != null ? items : new ArrayList<>();
        this.totalAmount = totalAmount;
    }

    public static CartBuilder builder() {
        return new CartBuilder();
    }

    public static class CartBuilder {
        private UUID id;
        private User user;
        private List<CartItem> items = new ArrayList<>();
        private BigDecimal totalAmount;

        CartBuilder() {
        }

        public CartBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public CartBuilder user(User user) {
            this.user = user;
            return this;
        }

        public CartBuilder items(List<CartItem> items) {
            this.items = items;
            return this;
        }

        public CartBuilder totalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public Cart build() {
            return new Cart(id, user, items, totalAmount);
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
