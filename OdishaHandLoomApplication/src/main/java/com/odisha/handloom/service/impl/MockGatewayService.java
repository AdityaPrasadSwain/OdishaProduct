package com.odisha.handloom.service.impl;

import com.odisha.handloom.entity.Payment;
import com.odisha.handloom.service.GatewayService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class MockGatewayService implements GatewayService {

    @Override
    public String initiatePayment(Payment payment) {
        // Mock Gateway Order ID
        return "mock_order_" + UUID.randomUUID().toString().substring(0, 8);
    }

    @Override
    public boolean verifyPayment(String paymentId, String orderId, String signature) {
        // Always mock success for "mock_payment_success"
        if ("mock_payment_failed".equals(paymentId))
            return false;
        return true;
    }

    @Override
    public String processRefund(String paymentId, BigDecimal amount) {
        return "mock_refund_" + UUID.randomUUID().toString().substring(0, 8);
    }
}
