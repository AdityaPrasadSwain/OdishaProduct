package com.odisha.handloom.service;

import com.odisha.handloom.entity.Cart;
import com.odisha.handloom.entity.CartItem;
import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.request.OrderItemRequest;
import com.odisha.handloom.repository.CartRepository;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Cart getCartForUser(UUID userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId).orElseThrow();
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setTotalAmount(BigDecimal.ZERO);
            return cartRepository.save(newCart);
        });
    }

    @Transactional
    public Cart mergeGuestCart(UUID userId, List<OrderItemRequest> guestItems) {
        Cart cart = getCartForUser(userId);
        
        for (OrderItemRequest guestItem : guestItems) {
            Optional<CartItem> existingItem = cart.getItems().stream()
                    .filter(item -> item.getProduct().getId().equals(guestItem.getProductId()))
                    .findFirst();

            if (existingItem.isPresent()) {
                // Combine quantities
                CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + guestItem.getQuantity());
            } else {
                // Add new item
                Product product = productRepository.findById(guestItem.getProductId()).orElse(null);
                if (product != null) {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    newItem.setQuantity(guestItem.getQuantity());
                    cart.getItems().add(newItem);
                }
            }
        }

        recalculateTotal(cart);
        return cartRepository.save(cart);
    }

    private void recalculateTotal(Cart cart) {
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            total = total.add(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        cart.setTotalAmount(total);
    }

    @Transactional
    public void clearCart(UUID userId) {
        Cart cart = getCartForUser(userId);
        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }
}
