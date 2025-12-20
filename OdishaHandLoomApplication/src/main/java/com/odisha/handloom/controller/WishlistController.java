package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.entity.Wishlist;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/customer/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Set<Product>> getWishlist() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Wishlist wishlist = wishlistService.getWishlistByUserId(user.getId());
        return ResponseEntity.ok(wishlist.getProducts());
    }

    @PostMapping("/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Set<Product>> toggleWishlist(@PathVariable UUID productId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<Product> updatedProducts = wishlistService.toggleWishlistProduct(user.getId(), productId);
        return ResponseEntity.ok(updatedProducts);
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> removeFromWishlist(@PathVariable UUID productId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        wishlistService.removeItemFromWishlist(user.getId(), productId);
        return ResponseEntity.ok(new MessageResponse("Product removed from wishlist"));
    }
}
