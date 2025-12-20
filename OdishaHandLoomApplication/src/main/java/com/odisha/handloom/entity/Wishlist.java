package com.odisha.handloom.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "wishlists")
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany
    @JoinTable(name = "wishlist_products", joinColumns = @JoinColumn(name = "wishlist_id"), inverseJoinColumns = @JoinColumn(name = "product_id"))
    private Set<Product> products = new HashSet<>();

    public Wishlist() {
    }

    public Wishlist(UUID id, User user, Set<Product> products) {
        this.id = id;
        this.user = user;
        this.products = products != null ? products : new HashSet<>();
    }

    public static WishlistBuilder builder() {
        return new WishlistBuilder();
    }

    public static class WishlistBuilder {
        private UUID id;
        private User user;
        private Set<Product> products = new HashSet<>();

        WishlistBuilder() {
        }

        public WishlistBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public WishlistBuilder user(User user) {
            this.user = user;
            return this;
        }

        public WishlistBuilder products(Set<Product> products) {
            this.products = products;
            return this;
        }

        public Wishlist build() {
            return new Wishlist(id, user, products);
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

    public Set<Product> getProducts() {
        return products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }
}
