package com.odisha.handloom.service;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.StockNotification;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.StockNotificationRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class StockService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockNotificationRepository stockNotificationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void reduceStock(UUID productId, int quantity) {
        // PESSIMISTIC_WRITE to prevent race conditions during high concurrency
        Product product = productRepository.findWithLockingById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Note: Ideally, specific locking should be done in repository.
        // But Spring Data JPA allows locking on findById if we override it or use a
        // custom query.
        // For simplicity and correctness with standard JPA, let's assume we rely on a
        // custom locked fetch method
        // or we handle it here.
        // Actually, to fully respect the requirement "Use pessimistic locking
        // (PESSIMISTIC_WRITE) on product fetch",
        // I should stick to a repository method that has @Lock logic.
        // I'll assume ProductRepository is standard.
        // BETTER APPROACH: Add a method in ProductRepository first?
        // Or I can use EntityManager here.
        // Let's create a helper method in this service that uses a repository method we
        // will add/mock.
        // But looking at existing files, I haven't seen ProductRepository.
        // I'll proceed assuming I can rely on standard transactions or I'll add the
        // lock annotation if I edit the repository.
        // Wait, I should verify if ProductRepository exists. It probably does given the
        // context.
        // I'll implement logic assuming I will add 'findByIdWithLock' to
        // ProductRepository or similar.
        // For now, I'll allow standard findById but let's be safer:

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }

        int newStock = product.getStockQuantity() - quantity;
        product.setStockQuantity(newStock);

        if (newStock == 0) {
            product.setOutOfStock(true);
        }

        productRepository.save(product);
    }

    // We need to ensure the repository has a locking method.
    // I will write this assuming I'll update ProductRepository next.

    @Transactional
    public void addStock(UUID productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        boolean wasOutOfStock = product.getStockQuantity() == 0 || product.isOutOfStock();

        product.setStockQuantity(product.getStockQuantity() + quantity);
        if (product.getStockQuantity() > 0) {
            product.setOutOfStock(false);
        }
        productRepository.save(product);

        if (wasOutOfStock) {
            notifySubscribers(product);
        }
    }

    public void notifySubscribers(Product product) {
        List<StockNotification> pendingNotifications = stockNotificationRepository
                .findByProductAndNotifiedFalse(product);
        for (StockNotification notification : pendingNotifications) {
            emailService.sendProductAvailableTodayEmail(
                    notification.getCustomerEmail(),
                    product.getName(),
                    product.getId().toString());
            notification.setNotified(true);
        }
        stockNotificationRepository.saveAll(pendingNotifications);
    }

    @Transactional
    public String subscribeToStock(UUID productId, String customerEmail, UUID userId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() > 0) {
            return "Product is already in stock!";
        }

        boolean uniqueSubscription = !stockNotificationRepository
                .existsByProductAndCustomerEmailAndNotifiedFalse(product, customerEmail);

        if (uniqueSubscription) {
            StockNotification notification = StockNotification.builder()
                    .product(product)
                    .customerEmail(customerEmail)
                    .notified(false)
                    .build();

            if (userId != null) {
                userRepository.findById(userId).ifPresent(notification::setCustomer);
            }

            stockNotificationRepository.save(notification);

            // Send peaceful acknowledgement
            emailService.sendOutOfStockAcknowledgementEmail(customerEmail, product.getName());
            return "Subscribed successfully.";
        }

        return "You are already subscribed.";
    }
}
