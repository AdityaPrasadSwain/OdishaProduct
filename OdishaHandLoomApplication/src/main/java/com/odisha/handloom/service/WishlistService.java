package com.odisha.handloom.service;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.entity.Wishlist;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Wishlist getWishlistByUserId(UUID userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Wishlist newWishlist = Wishlist.builder()
                            .user(user)
                            .build();
                    return wishlistRepository.save(newWishlist);
                });
    }

    @Transactional
    public Set<Product> toggleWishlistProduct(UUID userId, UUID productId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlist.getProducts().contains(product)) {
            wishlist.getProducts().remove(product);
        } else {
            wishlist.getProducts().add(product);
        }

        wishlistRepository.save(wishlist);
        return wishlist.getProducts();
    }

    @Transactional
    public void removeItemFromWishlist(UUID userId, UUID productId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        wishlist.getProducts().remove(product);
        wishlistRepository.save(wishlist);
    }
}
