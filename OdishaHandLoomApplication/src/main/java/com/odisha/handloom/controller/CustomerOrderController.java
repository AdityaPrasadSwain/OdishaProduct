package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Order;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.OrderRepository;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/customer/orders")
public class CustomerOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/{orderId}/invoice")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> downloadInvoice(@PathVariable UUID orderId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User customer = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            // Validation: Ensure customer owns the order
            if (!order.getUser().getId().equals(customer.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to view this invoice.");
            }

            // Validation: Check if invoice is generated/sent
            // Business rule: Can customer download before seller sends it?
            // The requirement says "Seller must send... before delivery".
            // It also says "Customer can download ONLY their invoices".
            // If the seller hasn't sent it yet, strictly speaking, it might not "exist"
            // officially.
            // However, technically we can generate it on the fly.
            // Let's enforce that the customer can only download if the status is at least
            // CONFIRMED or if the invoiceSent flag is true.
            // But to avoid confusion, let's behave as if the PDF is available if the order
            // is confirmed.
            // OR strictly follow the "Invoice Sent" flow.
            // Let's stick to: If invoiceSent is true, they can download.

            if (!order.isInvoiceSent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invoice has not been generated/sent by the seller yet.");
            }

            // Generate Invoice (or retrieve if we stored it - but we are generating on fly)
            byte[] invoicePdf = invoiceService.generateInvoice(order);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "invoice_" + orderId + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(invoicePdf, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating invoice: " + e.getMessage());
        }
    }
}
