package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Order;
import com.odisha.handloom.entity.OrderStatus;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.request.OrderRequest;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.OrderService;
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
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest orderRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User customer = userRepository.findByEmail(auth.getName()).orElseThrow();

        try {
            System.out.println("Received Order Request: " + orderRequest);
            List<Order> orders = orderService.createOrder(customer, orderRequest.getItems(),
                    orderRequest.getShippingAddress(),
                    orderRequest.getPaymentMethod(), orderRequest.getPaymentId(), orderRequest.getAddressId());
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("status", "SUCCESS");
            response.put("orders", orders);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> cancelOrder(@PathVariable UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User customer = userRepository.findByEmail(auth.getName()).orElseThrow();

        try {
            orderService.cancelOrder(id, customer.getId());
            return ResponseEntity.ok(new MessageResponse("Order cancelled successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Order> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User customer = userRepository.findByEmail(auth.getName()).orElseThrow();
        return orderService.getCustomerOrders(customer.getId());
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Order> getFilteredCustomerOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String range,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate from,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate to) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User customer = userRepository.findByEmail(auth.getName()).orElseThrow();

        return orderService.getFilteredCustomerOrders(customer.getId(), status, range, from, to);
    }

    @GetMapping("/seller-orders")

    @PreAuthorize("hasRole('SELLER')")
    public List<Order> getSellerOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        System.out.println("[OrderController] Fetching orders for seller: " + email);
        User seller = userRepository.findByEmail(email).orElseThrow();
        List<Order> orders = orderService.getSellerOrders(seller.getId());
        System.out.println("[OrderController] Found " + orders.size() + " orders for seller " + email);
        return orders;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('SELLER')")
    public ResponseEntity<?> getOrder(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.getOrder(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> updateStatus(@PathVariable UUID id, @RequestBody StatusUpdateRequest request) {
        orderService.updateStatus(id, request.getStatus(), request.getCourierName(), request.getTrackingId());
        return ResponseEntity.ok(new MessageResponse("Order status updated"));
    }

    @PutMapping("/{id}/return")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> requestReturn(@PathVariable UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User customer = userRepository.findByEmail(auth.getName()).orElseThrow();

        try {
            orderService.requestReturn(id, customer.getId());
            return ResponseEntity.ok(new MessageResponse("Return requested successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/replacement")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> requestReplacement(@PathVariable UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User customer = userRepository.findByEmail(auth.getName()).orElseThrow();

        try {
            orderService.requestReplacement(id, customer.getId());
            return ResponseEntity.ok(new MessageResponse("Replacement requested successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @Autowired
    private com.odisha.handloom.service.InvoiceService invoiceService;

    @GetMapping("/{id}/invoice")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('SELLER')")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable UUID id) {
        Order order = orderService.getOrder(id);

        // Security Check: ensure user owns order or is seller
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByEmail(auth.getName()).orElseThrow();

        boolean isOwner = order.getUser().getId().equals(currentUser.getId());
        boolean isSeller = order.getSeller().getId().equals(currentUser.getId());

        if (!isOwner && !isSeller) {
            return ResponseEntity.status(403).build();
        }

        byte[] pdfBytes = invoiceService.generateInvoice(order);

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice_" + id + ".pdf")
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "application/pdf")
                .body(pdfBytes);
    }

    // Helper class for payload
    public static class StatusUpdateRequest {
        private OrderStatus status;
        private String courierName;
        private String trackingId;

        public OrderStatus getStatus() {
            return status;
        }

        public void setStatus(OrderStatus status) {
            this.status = status;
        }

        public String getCourierName() {
            return courierName;
        }

        public void setCourierName(String courierName) {
            this.courierName = courierName;
        }

        public String getTrackingId() {
            return trackingId;
        }

        public void setTrackingId(String trackingId) {
            this.trackingId = trackingId;
        }
    }
}
