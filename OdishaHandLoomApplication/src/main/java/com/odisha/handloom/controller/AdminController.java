package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.Role;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    com.odisha.handloom.repository.OrderRepository orderRepository;

    @GetMapping("/sellers")
    public List<User> getAllSellers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.SELLER)
                .collect(Collectors.toList());
    }

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/orders")
    public List<com.odisha.handloom.entity.Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<?> getAnalyticsSummary() {
        long totalSales = orderRepository.count();
        long totalRevenue = orderRepository.findAll().stream()
                .mapToLong(order -> order.getTotalAmount() != null ? order.getTotalAmount().longValue() : 0L)
                .sum();
        long newCustomers = userRepository.count();
        long returnedProducts = 0;

        return ResponseEntity.ok(java.util.Map.of(
                "totalSales", totalSales,
                "salesDelta", 5.0,
                "newCustomers", newCustomers,
                "customersDelta", 2.5,
                "returnedProducts", returnedProducts,
                "returnsDelta", 0.0,
                "totalRevenue", totalRevenue,
                "revenueDelta", 10.0));
    }

    @GetMapping("/analytics/country")
    public ResponseEntity<?> getCountryStats() {
        // Mock data using robust HashMap to avoid type inference issues
        java.util.List<java.util.Map<String, Object>> stats = new java.util.ArrayList<>();

        java.util.Map<String, Object> india = new java.util.HashMap<>();
        india.put("country", "India");
        india.put("value", 80);
        stats.add(india);

        java.util.Map<String, Object> usa = new java.util.HashMap<>();
        usa.put("country", "USA");
        usa.put("value", 10);
        stats.add(usa);

        java.util.Map<String, Object> uk = new java.util.HashMap<>();
        uk.put("country", "UK");
        uk.put("value", 5);
        stats.add(uk);

        java.util.Map<String, Object> others = new java.util.HashMap<>();
        others.put("country", "Others");
        others.put("value", 5);
        stats.add(others);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/analytics/revenue")
    public ResponseEntity<?> getRevenueData() {
        // Return mock monthly data for now
        return ResponseEntity.ok(List.of(
                java.util.Map.of("name", "Jan", "value", 1000),
                java.util.Map.of("name", "Feb", "value", 2000),
                java.util.Map.of("name", "Mar", "value", 1500),
                java.util.Map.of("name", "Apr", "value", 3000),
                java.util.Map.of("name", "May", "value", 2500),
                java.util.Map.of("name", "Jun", "value", 4000)));
    }

    @PutMapping("/sellers/{id}/approve")
    public ResponseEntity<?> approveSeller(@PathVariable UUID id) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Error: Seller not found."));
        seller.setApproved(true);
        userRepository.save(seller);
        return ResponseEntity.ok(new MessageResponse("Seller approved successfully!"));
    }

    @PutMapping("/sellers/{id}/block")
    public ResponseEntity<?> blockSeller(@PathVariable UUID id) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Error: Seller not found."));
        seller.setBlocked(true);
        userRepository.save(seller);
        return ResponseEntity.ok(new MessageResponse("Seller blocked successfully!"));
    }

    @PutMapping("/sellers/{id}/unblock")
    public ResponseEntity<?> unblockSeller(@PathVariable UUID id) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Error: Seller not found."));
        seller.setBlocked(false);
        userRepository.save(seller);
        return ResponseEntity.ok(new MessageResponse("Seller unblocked successfully!"));
    }

    @PutMapping("/products/{id}/approve")
    public ResponseEntity<?> approveProduct(@PathVariable UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Product not found."));
        product.setApproved(true);
        productRepository.save(product);
        return ResponseEntity.ok(new MessageResponse("Product approved successfully!"));
    }

    @PutMapping("/products/{id}/unapprove")
    public ResponseEntity<?> unapproveProduct(@PathVariable UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Product not found."));
        product.setApproved(false);
        productRepository.save(product);
        return ResponseEntity.ok(new MessageResponse("Product unapproved successfully!"));
    }

    @Autowired
    com.odisha.handloom.repository.OrderItemRepository orderItemRepository;

    @DeleteMapping("/products/{id}/reject")
    public ResponseEntity<?> rejectProduct(@PathVariable UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Product not found."));

        if (orderItemRepository.existsByProduct_Id(id)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Cannot delete product. It is part of existing orders."));
        }

        productRepository.delete(product);
        return ResponseEntity.ok(new MessageResponse("Product rejected (deleted) successfully!"));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        // Add more stats like total orders, revenue
        return ResponseEntity.ok("{\"users\": " + totalUsers + ", \"products\": " + totalProducts + "}");
    }

    @DeleteMapping("/sellers/{id}")
    @Transactional
    public ResponseEntity<?> deleteSeller(@PathVariable UUID id) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Error: Seller not found."));

        // Delete all products by this seller first to avoid FK constraints
        List<Product> sellerProducts = productRepository.findAll().stream()
                .filter(p -> p.getSeller().getId().equals(id))
                .collect(Collectors.toList());
        productRepository.deleteAll(sellerProducts);

        userRepository.delete(seller);
        return ResponseEntity.ok(new MessageResponse("Seller and their products deleted successfully!"));
    }
}
