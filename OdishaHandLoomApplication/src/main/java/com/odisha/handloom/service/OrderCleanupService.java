package com.odisha.handloom.service;

import com.odisha.handloom.entity.Order;
import com.odisha.handloom.entity.OrderItem;
import com.odisha.handloom.entity.OrderStatus;
import com.odisha.handloom.entity.Product;
import com.odisha.handloom.repository.OrderRepository;
import com.odisha.handloom.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderCleanupService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // Run every 5 minutes
    @Scheduled(fixedRate = 300000)
    @Transactional
    public void cleanupAbandonedOrders() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(15);
        List<Order> abandonedOrders = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.PENDING, cutoffTime);

        for (Order order : abandonedOrders) {
            System.out.println("[OrderCleanup] Expiring abandoned order: " + order.getId());
            order.setStatus(OrderStatus.EXPIRED);

            // Release reserved stock
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }

            orderRepository.save(order);
        }
    }
}
