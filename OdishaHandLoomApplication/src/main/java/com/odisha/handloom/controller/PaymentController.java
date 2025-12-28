package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Payment;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.enums.PaymentMethod;
import com.odisha.handloom.enums.PaymentStatus;
import com.odisha.handloom.exception.ResourceNotFoundException;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.security.jwt.JwtUtils;
import com.odisha.handloom.service.PaymentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @PostMapping("/initiate")
    public ResponseEntity<?> initiatePayment(@RequestHeader("Authorization") String token,
            @RequestBody PaymentInitiateRequest request) {
        String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Payment payment = paymentService.initiatePayment(user.getId(), request.getOrderId(), request.getMethod());

        return ResponseEntity.ok(Map.of(
                "paymentId", payment.getId(),
                "transactionId", payment.getTransactionId(),
                "gatewayRef", payment.getGatewayRef() != null ? payment.getGatewayRef() : "",
                "amount", payment.getAmount(),
                "status", payment.getStatus()));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestHeader("Authorization") String token,
            @RequestBody PaymentVerifyRequest request) {
        String email = jwtUtils.getUserNameFromJwtToken(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Payment payment = paymentService.verifyPayment(user.getId(), request.getOrderId(), request.getPaymentId(),
                request.getOrderRef(), request.getSignature());

        return ResponseEntity.ok(Map.of(
                "success", payment.getStatus() == PaymentStatus.SUCCESS,
                "status", payment.getStatus()));
    }

    @Data
    public static class PaymentInitiateRequest {
        private UUID orderId;
        private PaymentMethod method;
    }

    @Data
    public static class PaymentVerifyRequest {
        private UUID orderId;
        private String paymentId; // from Gateway specific
        private String orderRef; // from Gateway specific
        private String signature;
    }
}
