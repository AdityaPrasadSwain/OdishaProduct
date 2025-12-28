package com.odisha.handloom.service;

import com.odisha.handloom.entity.Payment;
import java.math.BigDecimal;

public interface GatewayService {

    /**
     * Initiates a payment request with the gateway.
     * 
     * @param payment The payment entity (contains amount, transactionId, user
     *                info).
     * @return Gateway specific order ID or token.
     */
    String initiatePayment(Payment payment);

    /**
     * Verifies the payment signature/status from gateway response.
     * 
     * @param paymentId Gateway payment ID (e.g. raz_pay_123).
     * @param orderId   Gateway order ID (e.g. raz_order_123).
     * @param signature Gateway signature.
     * @return true if valid, false otherwise.
     */
    boolean verifyPayment(String paymentId, String orderId, String signature);

    /**
     * Process a refund.
     * 
     * @param paymentId Payment transaction ID.
     * @param amount    Amount to refund.
     * @return Refund ID.
     */
    String processRefund(String paymentId, BigDecimal amount);
}
