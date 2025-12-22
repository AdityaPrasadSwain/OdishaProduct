package com.odisha.handloom.service;

import com.odisha.handloom.entity.OrderItem;
import com.odisha.handloom.entity.ReturnRequest;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.OrderItemRepository;
import com.odisha.handloom.repository.ReturnRequestRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class ReturnService {

    @Autowired
    private ReturnRequestRepository returnRequestRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AdminNotificationService adminNotificationService;

    @Transactional
    public ReturnRequest createReturnRequest(UUID orderItemId, String reason, String description,
            ReturnRequest.ReturnType type, String proofImageUrl, UUID customerId) {
        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("Order Item not found"));

        // 1. Validate Ownership
        if (!item.getOrder().getUser().getId().equals(customerId)) {
            throw new RuntimeException("You are not authorized to return this item.");
        }

        // 2. Validate Return Window (10 Days from delivery)
        // Assuming Order 'updatedAt' as delivery time if status is DELIVERED
        // Ideally we should have a 'deliveredAt' field, but using updatedAt for now as
        // per constraints
        if (!"DELIVERED".equals(item.getOrder().getStatus().name())) {
            throw new RuntimeException("Item must be delivered before it can be returned.");
        }

        long daysSinceDelivery = ChronoUnit.DAYS.between(item.getOrder().getUpdatedAt(), LocalDateTime.now());
        if (daysSinceDelivery > 10) {
            throw new RuntimeException("Return window closed. Returns are only allowed within 10 days of delivery.");
        }

        // 3. Check for duplicates
        if (returnRequestRepository.existsByOrderItemId(orderItemId)) {
            throw new RuntimeException("A return request for this item already exists.");
        }

        ReturnRequest request = new ReturnRequest();
        request.setOrderItem(item);
        request.setCustomer(item.getOrder().getUser());
        request.setSeller(item.getProduct().getSeller());
        request.setReason(reason);
        request.setDescription(description);
        request.setType(type);
        request.setProofImageUrl(proofImageUrl);
        request.setStatus(ReturnRequest.ReturnStatus.PENDING);

        ReturnRequest savedRequest = returnRequestRepository.save(request);

        // Notify Seller (System Notification)
        notificationService.createNotification(request.getSeller(), "Return Requested",
                "A return has been requested for " + item.getProduct().getName() + " by "
                        + request.getCustomer().getFullName());

        // Send Email to Seller
        try {
            User seller = request.getSeller();
            emailService.sendSellerReturnRequestEmail(
                    seller.getEmail(),
                    seller.getShopName() != null ? seller.getShopName() : seller.getFullName(),
                    savedRequest.getOrderItem().getOrder().getId().toString().substring(0, 8),
                    savedRequest.getOrderItem().getProduct().getName(),
                    savedRequest.getType().toString());
        } catch (Exception e) {
            System.err.println("[ReturnService] Failed to send email to seller: " + e.getMessage());
        }

        // Notify Admins
        List<User> admins = userRepository.findByRole(com.odisha.handloom.entity.Role.ADMIN);
        for (User admin : admins) {
            notificationService.createNotification(admin, "New Return Request",
                    "Return request #" + savedRequest.getId().toString().substring(0, 8) + " needs attention.");
        }

        // Notify Admin (New System)
        adminNotificationService.notifyReturnRequest(savedRequest.getId(),
                savedRequest.getOrderItem().getOrder().getId().toString().substring(0, 8));

        // Send Email to Customer
        try {
            String orderId = savedRequest.getOrderItem().getOrder().getId().toString().substring(0, 8);
            String productName = savedRequest.getOrderItem().getProduct().getName();

            if (savedRequest.getType() == ReturnRequest.ReturnType.REPLACEMENT) {
                emailService.sendReplacementRequestSubmittedEmail(
                        savedRequest.getCustomer().getEmail(),
                        savedRequest.getCustomer().getFullName(),
                        orderId,
                        productName);
            } else {
                emailService.sendReturnRequestSubmittedEmail(
                        savedRequest.getCustomer().getEmail(),
                        savedRequest.getCustomer().getFullName(),
                        orderId,
                        productName);
            }
        } catch (Exception e) {
            System.err.println("Failed to send return/replacement email: " + e.getMessage());
        }

        return savedRequest;
    }

    public List<ReturnRequest> getSellerReturnRequests(UUID sellerId) {
        return returnRequestRepository.findBySellerId(sellerId);
    }

    public List<ReturnRequest> getCustomerReturnRequests(UUID customerId) {
        return returnRequestRepository.findByCustomerId(customerId);
    }

    @Transactional
    public ReturnRequest processReturnRequest(UUID requestId, ReturnRequest.ReturnStatus status, String remarks,
            UUID sellerId) {
        ReturnRequest request = returnRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Return Request not found"));

        if (!request.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Not authorized to process this return.");
        }

        request.setStatus(status);
        request.setSellerRemarks(remarks);

        ReturnRequest savedRequest = returnRequestRepository.save(request);

        // Notify Customer
        notificationService.createNotification(request.getCustomer(), "Return Update",
                "Your return request for " + request.getOrderItem().getProduct().getName() + " has been " + status
                        + ".");

        return savedRequest;
    }
}
