package com.odisha.handloom.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;
    private BigDecimal price; // Price at time of adding (optional, or dynamic)

    public CartItem() {
    }

    public CartItem(UUID id, Cart cart, Product product, Integer quantity, BigDecimal price) {
        this.id = id;
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }

    public static CartItemBuilder builder() {
        return new CartItemBuilder();
    }

    public static class CartItemBuilder {
        private UUID id;
        private Cart cart;
        private Product product;
        private Integer quantity;
        private BigDecimal price;

        CartItemBuilder() {
        }

        public CartItemBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public CartItemBuilder cart(Cart cart) {
            this.cart = cart;
            return this;
        }

        public CartItemBuilder product(Product product) {
            this.product = product;
            return this;
        }

        public CartItemBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public CartItemBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public CartItem build() {
            return new CartItem(id, cart, product, quantity, price);
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
