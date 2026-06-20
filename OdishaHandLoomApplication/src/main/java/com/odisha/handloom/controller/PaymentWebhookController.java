package com.odisha.handloom.controller;

import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payments/webhook")
public class PaymentWebhookController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> payload, @RequestHeader Map<String, String> headers) {
        try {
            System.out.println("Received Payment Webhook: " + payload);
            
            // In a real implementation, we would extract paymentId, orderId, and signature from the payload/headers
            // String paymentId = (String) payload.get("paymentId");
            // String orderId = (String) payload.get("orderId");
            // String signature = headers.get("x-signature");

            // For now, we just simulate success if status is captured
            String status = (String) payload.get("status");
            if ("captured".equalsIgnoreCase(status)) {
                // paymentService.verifyPayment(userId, orderId, paymentId, gatewayRef, signature);
                System.out.println("Webhook: Payment Captured.");
            } else if ("failed".equalsIgnoreCase(status)) {
                System.out.println("Webhook: Payment Failed.");
            }

            return ResponseEntity.ok(new MessageResponse("Webhook processed"));
        } catch (Exception e) {
            System.err.println("Webhook Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse("Webhook processing failed"));
        }
    }
}
