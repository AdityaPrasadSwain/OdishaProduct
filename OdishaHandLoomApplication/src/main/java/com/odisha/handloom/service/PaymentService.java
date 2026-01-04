package com.odisha.handloom.service;

import com.odisha.handloom.entity.Order;
import com.odisha.handloom.entity.OrderStatus;
import com.odisha.handloom.entity.Payment;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.enums.PaymentMethod;
import com.odisha.handloom.enums.PaymentStatus;
import com.odisha.handloom.exception.ResourceNotFoundException;
import com.odisha.handloom.repository.OrderRepository;
import com.odisha.handloom.repository.PaymentRepository;
import com.odisha.handloom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final GatewayService gatewayService;
    private final EmailService emailService;
    private final UserRepository userRepository;

    private final com.odisha.handloom.finance.service.PlatformWalletService platformWalletService;

    @Transactional
    public Payment initiatePayment(UUID userId, UUID orderId, PaymentMethod method) {
        if (orderId == null) {
            throw new IllegalArgumentException("Order ID must not be null");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized payment attempt");
        }

        // Check if cached payment exists and is PENDING
        // For simplicity, we create specific payment entry

        Payment payment = Payment.builder()
                .order(order)
                .user(order.getUser())
                .seller(order.getSeller())
                .amount(order.getTotalAmount())
                .paymentMethod(method)
                .status(method == PaymentMethod.COD ? PaymentStatus.COD_PENDING_DELIVERY : PaymentStatus.PENDING)
                .transactionId("TXN_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase())
                .build();

        if (method != PaymentMethod.COD) {
            String gatewayRef = gatewayService.initiatePayment(payment);
            payment.setGatewayRef(gatewayRef);
            payment.setStatus(PaymentStatus.INITIATED);
        } else {
            // Confirm COD Order immediately
            order.setPaymentMethod("COD");
            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);

            // Notify
            sendOrderConfirmationEmail(order);
        }

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment verifyPayment(UUID userId, UUID orderId, String paymentId, String orderRef, String signature) {
        Payment payment = paymentRepository.findByOrderId(orderId);
        if (payment == null) {
            throw new ResourceNotFoundException("Payment", "orderId", orderId);
        }

        boolean isValid = gatewayService.verifyPayment(paymentId, orderRef, signature);

        if (isValid) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setGatewayRef(paymentId); // Update with actual Charge ID

            // Credit Platform Wallet
            platformWalletService.credit(
                    payment.getAmount(),
                    com.odisha.handloom.finance.entity.WalletTransaction.TransactionSource.ORDER_PAYMENT,
                    orderId.toString(),
                    "Payment for Order #" + orderId);

            Order order = payment.getOrder();
            order.setStatus(OrderStatus.CONFIRMED);
            order.setPaymentMethod(payment.getPaymentMethod().toString());
            order.setPaymentId(paymentId);
            orderRepository.save(order);

            sendOrderConfirmationEmail(order);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Signature Verification Failed");
        }

        return paymentRepository.save(payment);
    }

    private void sendOrderConfirmationEmail(Order order) {
        try {
            emailService.sendOrderConfirmationEmail(
                    order.getUser().getEmail(),
                    order.getUser().getFullName(),
                    order.getId().toString(),
                    order.getTotalAmount(),
                    order.getOrderItems(),
                    null // Invoice PDF will be generated and sent later if needed, or we can integrate
                         // it here if we had the service
            );
        } catch (Exception e) {
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }
    }
}
