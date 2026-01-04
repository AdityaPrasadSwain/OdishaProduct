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
    private com.odisha.handloom.repository.ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private com.odisha.handloom.service.LabelService labelService;

    @Autowired
    private com.odisha.handloom.service.PackagingVideoService videoService;

    @GetMapping("/{orderId}/label")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> downloadLabel(@PathVariable UUID orderId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User seller = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Seller not found"));

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if (!order.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
            }

            // Generate Label
            byte[] labelPdf = labelService.generateShippingLabel(order);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=Label_" + orderId + ".pdf")
                    .body(labelPdf);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating label: " + e.getMessage());
        }
    }

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

    @PostMapping("/{orderId}/accept")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> acceptOrder(@PathVariable UUID orderId, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User seller = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Seller not found"));

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if (!order.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
            }

            if (order.getStatus() != OrderStatus.PENDING) {
                return ResponseEntity.badRequest().body("Order is not in PENDING state.");
            }

            // Update Status
            order.setStatus(OrderStatus.SELLER_CONFIRMED);
            orderRepository.save(order);

            // Make Packaging Video Visible
            try {
                videoService.markVisible(orderId);
            } catch (Exception e) {
                System.err.println("Failed to mark video visible: " + e.getMessage());
            }

            // Notify Customer
            emailService.sendOrderFormattedEmail(
                    order.getUser().getEmail(),
                    "Order Confirmed by Seller",
                    "Your order #" + order.getId().toString().substring(0, 8)
                            + " has been confirmed by the seller and is being processed.",
                    order.getUser().getFullName());

            return ResponseEntity.ok("Order accepted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error accepting order: " + e.getMessage());
        }
    }

    @PostMapping("/{orderId}/reject")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> rejectOrder(@PathVariable UUID orderId, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User seller = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Seller not found"));

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if (!order.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
            }

            if (order.getStatus() != OrderStatus.PENDING) {
                return ResponseEntity.badRequest().body("Order can only be rejected if PENDING.");
            }

            // Restore Stock
            for (var item : order.getOrderItems()) {
                var product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }

            order.setStatus(OrderStatus.ORDER_CANCELLED_BY_SELLER);
            orderRepository.save(order);

            // Create notification for Customer
            // emailService...

            return ResponseEntity.ok("Order rejected.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error rejecting order: " + e.getMessage());
        }
    }

    @PostMapping("/{orderId}/pack")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> markAsPacked(@PathVariable UUID orderId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User seller = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Seller not found"));

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if (!order.getSeller().getId().equals(seller.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
            }

            if (order.getStatus() != OrderStatus.SELLER_CONFIRMED &&
                    order.getStatus() != OrderStatus.INVOICE_SENT &&
                    order.getStatus() != OrderStatus.CONFIRMED) {
                return ResponseEntity.badRequest()
                        .body("Order must be CONFIRMED, SELLER_CONFIRMED or INVOICE_SENT before packing.");
            }

            if (!order.isInvoiceSent()) {
                return ResponseEntity.badRequest().body("Please send invoice before packing.");
            }

            order.setStatus(OrderStatus.PACKED);
            orderRepository.save(order);

            // Notify Customer? Optional.

            return ResponseEntity.ok("Order marked as PACKED.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error marking as packed: " + e.getMessage());
        }
    }

    @PostMapping("/bulk-labels")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> downloadBulkLabels(@RequestBody java.util.List<UUID> orderIds,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User seller = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Seller not found"));

            java.util.List<Order> orders = orderRepository.findAllById(orderIds);

            if (orders.isEmpty()) {
                return ResponseEntity.badRequest().body("No valid orders found.");
            }

            // Security: Ensure all orders belong to this seller
            for (Order o : orders) {
                if (!o.getSeller().getId().equals(seller.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Unauthorized access to one or more orders.");
                }
            }

            // Generate Bulk PDF
            byte[] bulkPdf = labelService.generateBulkShippingLabels(orders);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition",
                            "attachment; filename=Bulk_Labels_" + java.time.LocalDateTime.now().toLocalDate() + ".pdf")
                    .body(bulkPdf);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating bulk labels: " + e.getMessage());
        }
    }
}
