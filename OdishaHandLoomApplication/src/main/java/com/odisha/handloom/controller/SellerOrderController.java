package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Order;
import com.odisha.handloom.entity.OrderStatus;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.OrderRepository;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.EmailService;
import com.odisha.handloom.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/seller/orders")
public class SellerOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/{orderId}/send-invoice")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> sendInvoice(@PathVariable UUID orderId, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User seller = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Seller not found"));

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            // Validation: Ensure seller owns the order
            if (!order.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to manage this order.");
            }

            // Validation: Check if already sent
            if (order.isInvoiceSent()) {
                return ResponseEntity.badRequest().body("Invoice already sent for this order.");
            }

            // Generate Invoice
            byte[] invoicePdf = invoiceService.generateInvoice(order);

            // Send Email
            emailService.sendThankYouInvoiceEmail(
                    order.getUser().getEmail(),
                    order.getUser().getFullName(),
                    order.getId().toString(),
                    invoicePdf);

            // Update Order Status
            order.setInvoiceSent(true);
            order.setInvoiceSentAt(LocalDateTime.now());
            order.setStatus(OrderStatus.INVOICE_SENT);

            // Assign a simplified invoice number if not already present
            if (order.getInvoiceNumber() == null) {
                order.setInvoiceNumber("INV-" + LocalDateTime.now().getYear() + "-"
                        + order.getId().toString().substring(0, 6).toUpperCase());
            }

            orderRepository.save(order);

            return ResponseEntity.ok("Invoice sent successfully.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending invoice: " + e.getMessage());
        }
    }
}
