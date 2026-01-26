package com.odisha.handloom.service;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.StockNotification;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.StockNotificationRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class StockNotificationService {

    @Autowired
    private StockNotificationRepository stockNotificationRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void createNotificationRequest(UUID productId, String userEmail) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() != null && product.getStockQuantity() > 0) {
            throw new RuntimeException("Product is already in stock");
        }

        // Check if already requested and not yet notified
        if (stockNotificationRepository.existsByProductAndCustomerEmailAndNotifiedFalse(product, userEmail)) {
            // Already engaged, maybe just return silently or throw specific message
            throw new RuntimeException("You are already on the waitlist for this product");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StockNotification notification = StockNotification.builder()
                .product(product)
                .customer(user)
                .customerEmail(userEmail)
                .notified(false)
                .requestedAt(LocalDateTime.now())
                .build();

        stockNotificationRepository.save(notification);
    }
}
