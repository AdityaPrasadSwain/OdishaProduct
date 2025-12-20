package com.odisha.handloom.controller;

import com.odisha.handloom.entity.*;
import com.odisha.handloom.payload.request.OrderRequest;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.repository.OrderRepository;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    com.odisha.handloom.service.OrderService orderService;

    @Autowired
    com.odisha.handloom.service.ProductService productService;

    @GetMapping("/products")
    public List<Product> getAllProducts(@RequestParam(required = false) String search) {
        System.out.println("[CustomerController] Request to fetch all public products");
        if (search != null && !search.isEmpty()) {
            System.out.println("[CustomerController] Searching for: " + search);
            return productRepository.findByNameContainingIgnoreCase(search);
        }
        List<Product> products = productRepository.findByIsApprovedTrue();
        System.out.println("[CustomerController] Found " + products.size() + " approved products");
        return products;
    }

    @GetMapping("/products/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable UUID categoryId) {
        return productRepository.findByCategory_Id(categoryId);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable UUID id) {
        Product product = productService.getProductDetails(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping("/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User customer = userRepository.findByEmail(auth.getName()).orElseThrow();

        try {
            orderService.createOrder(customer, orderRequest.getItems(), orderRequest.getShippingAddress(),
                    orderRequest.getPaymentMethod(), orderRequest.getPaymentId(), orderRequest.getAddressId());
            return ResponseEntity.ok(new MessageResponse("Orders placed successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Order> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User customer = userRepository.findByEmail(auth.getName()).orElseThrow();
        return orderRepository.findByUserId(customer.getId());
    }
}
