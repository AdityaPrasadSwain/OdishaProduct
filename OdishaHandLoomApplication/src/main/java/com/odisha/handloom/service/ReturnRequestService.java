package com.odisha.handloom.service;

import com.odisha.handloom.dto.ReturnRequestDTO;
import com.odisha.handloom.entity.*;
import com.odisha.handloom.entity.OrderStatus; // Fixed Import
import com.odisha.handloom.enums.ReturnReason;
import com.odisha.handloom.enums.ReturnStatus;
import com.odisha.handloom.exception.ResourceNotFoundException;
import com.odisha.handloom.repository.OrderItemRepository;
import com.odisha.handloom.repository.ReturnRequestRepository;
import com.odisha.handloom.repository.ReturnStatusLogRepository;
import com.odisha.handloom.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReturnRequestService {

    private final ReturnRequestRepository returnRequestRepository;

    private final OrderItemRepository orderItemRepository;

    private final UserRepository userRepository;

    private final EmailService emailService;

    private final RefundService refundService;

    private final ReturnStatusLogRepository returnStatusLogRepository;

    @Transactional
    public ReturnRequestDTO.Response createReturnRequest(UUID customerId, ReturnRequestDTO.CreateRequest request) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customerId));

        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem", "id", request.getOrderItemId()));

        if (!orderItem.getOrder().getUser().getId().equals(customerId)) {
            throw new RuntimeException("This order item does not belong to the user");
        }

        if (returnRequestRepository.existsByOrderItemId(request.getOrderItemId())) {
            throw new RuntimeException("Return request already exists for this item");
        }

        // Strict FK Validation: Ensure Order exists linked to Item
        if (orderItem.getOrder() == null) {
            throw new ResourceNotFoundException("Order", "orderItem", request.getOrderItemId());
        }

        // Return Window Validation (7 Days) from Delivery
        // Only allow if order is delivered
        if (orderItem.getOrder().getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot return item that is not marked as DELIVERED.");
        }

        // Use updatedAt as delivery proxy if deliveryDate doesn't exist, as confirmed
        LocalDateTime deliveryTime = orderItem.getOrder().getUpdatedAt();
        if (ChronoUnit.DAYS.between(deliveryTime, LocalDateTime.now()) > 7) {
            throw new RuntimeException("Return window closed. Returns only allowed within 7 days of delivery.");
        }

        // Validation: Proof image required for DAMAGED or WRONG product
        if ((request.getReason() == ReturnReason.DAMAGED || request.getReason() == ReturnReason.WRONG_PRODUCT)
                && (request.getProofImageUrl() == null || request.getProofImageUrl().isEmpty())) {
            throw new RuntimeException("Proof image is required for Damaged or Wrong Product returns.");
        }

        ReturnRequest returnRequest = ReturnRequest.builder()
                .customer(customer)
                .order(orderItem.getOrder())
                .orderItem(orderItem)
                .seller(orderItem.getProduct().getSeller()) // Assuming Product has seller
                .reason(request.getReason())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .proofImageUrl(request.getProofImageUrl())
                .status(ReturnStatus.PENDING)
                .build();

        returnRequest = returnRequestRepository.save(returnRequest);

        // Notify Customer & Seller
        try {
            emailService.sendReturnRequestSubmittedEmail(customer.getEmail(), customer.getFullName(),
                    orderItem.getOrder().getId().toString(), orderItem.getProduct().getName());
            emailService.sendSellerReturnRequestEmail(returnRequest.getSeller().getEmail(),
                    returnRequest.getSeller().getFullName(), orderItem.getOrder().getId().toString(),
                    orderItem.getProduct().getName(), "RETURN");
        } catch (Exception e) {
            System.err.println("Failed to send return emails: " + e.getMessage());
        }

        // Log Status
        logStatusChange(returnRequest, null, ReturnStatus.PENDING, customerId);

        return mapToResponse(returnRequest);
    }

    public List<ReturnRequestDTO.Response> getCustomerReturns(UUID customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customerId));
        return returnRequestRepository.findByCustomer(customer).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReturnRequestDTO.Response> getSellerReturns(UUID sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "id", sellerId));
        return returnRequestRepository.findBySeller(seller).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReturnRequestDTO.Response> getAllReturnsForAdmin() {
        return returnRequestRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ReturnRequestDTO.Response getReturnRequestById(UUID id) {
        ReturnRequest returnRequest = returnRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ReturnRequest", "id", id));
        return mapToResponse(returnRequest);
    }

    @Transactional
    public ReturnRequestDTO.Response updateSellerDecision(UUID sellerId, UUID requestId,
            ReturnRequestDTO.SellerDecision decision) {
        ReturnRequest request = returnRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("ReturnRequest", "id", requestId));

        if (!request.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Not authorized to manage this return");
        }

        if (request.getStatus() != ReturnStatus.PENDING && request.getStatus() != ReturnStatus.PICKUP_SCHEDULED) {
            throw new RuntimeException("Cannot change status from " + request.getStatus());
        }

        ReturnStatus oldStatus = request.getStatus();
        ReturnStatus newStatus;

        if (decision.isApproved()) {
            newStatus = ReturnStatus.APPROVED;
            // logic to schedule pickup could be triggered here, or moved to
            // 'PICKUP_SCHEDULED'
            // For now, approved implies pickup will be scheduled.

            // Notify Customer
            try {
                emailService.sendHtmlEmail(request.getCustomer().getEmail(), "Return Approved",
                        "<p>Your return request for " + request.getOrderItem().getProduct().getName()
                                + " has been approved by the seller. Pickup will be scheduled shortly.</p>");
            } catch (Exception e) {
                System.err.println("Failed to send approval email: " + e.getMessage());
            }

        } else {
            newStatus = ReturnStatus.REJECTED;
            try {
                emailService.sendHtmlEmail(request.getCustomer().getEmail(), "Return Rejected",
                        "<p>Your return request for " + request.getOrderItem().getProduct().getName()
                                + " has been rejected. Reason: " + decision.getRemarks() + "</p>");
            } catch (Exception e) {
                System.err.println("Failed to send rejection email: " + e.getMessage());
            }
        }

        request.setStatus(newStatus);
        request.setSellerRemarks(decision.getRemarks());

        request = returnRequestRepository.save(request);
        logStatusChange(request, oldStatus, newStatus, sellerId);

        return mapToResponse(request);
    }

    @Transactional
    public ReturnRequestDTO.Response updateAdminDecision(UUID requestId, ReturnRequestDTO.AdminDecision decision) {
        ReturnRequest request = returnRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("ReturnRequest", "id", requestId));

        ReturnStatus oldStatus = request.getStatus();
        request.setStatus(decision.getStatus());
        if (decision.getComment() != null) {
            request.setAdminComment(decision.getComment());
        }

        request = returnRequestRepository.save(request);

        // Assuming system/admin action, changedBy can be null or we'd need admin ID
        // context
        logStatusChange(request, oldStatus, decision.getStatus(), null);

        if (decision.getStatus() == ReturnStatus.REFUND_INITIATED) {
            refundService.initiateRefund(request);
            try {
                emailService.sendHtmlEmail(request.getCustomer().getEmail(), "Refund Initiated",
                        "<p>We have initiated your refund of ₹" + request.getOrderItem().getPrice() + " for "
                                + request.getOrderItem().getProduct().getName() + ".</p>");
            } catch (Exception e) {
                System.err.println("Failed to send refund email: " + e.getMessage());
            }
        }

        return mapToResponse(request);
    }

    public void cancelReturnRequest(UUID customerId, UUID requestId) {
        ReturnRequest request = returnRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("ReturnRequest", "id", requestId));

        if (!request.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Not authorized to cancel this return");
        }

        if (request.getStatus() != ReturnStatus.PENDING) {
            throw new RuntimeException("Cannot cancel return once processed");
        }

        returnRequestRepository.delete(request);
    }

    private void logStatusChange(ReturnRequest request, ReturnStatus oldStatus, ReturnStatus newStatus,
            UUID changedBy) {
        try {
            ReturnStatusLog log = new ReturnStatusLog(request, oldStatus, newStatus, changedBy);
            returnStatusLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Failed to log return status change: " + e.getMessage());
        }
    }

    private ReturnRequestDTO.Response mapToResponse(ReturnRequest request) {
        ReturnRequestDTO.Response response = new ReturnRequestDTO.Response();
        response.setId(request.getId());
        response.setOrderId(request.getOrder().getId());
        response.setOrderItemId(request.getOrderItem().getId());
        response.setCustomerId(request.getCustomer().getId());
        response.setCustomerName(request.getCustomer().getFullName());

        response.setSellerId(request.getSeller().getId());
        response.setSellerName(request.getSeller().getFullName());

        response.setProductName(request.getOrderItem().getProduct().getName());

        String img = "";
        if (request.getOrderItem().getProduct().getImages() != null
                && !request.getOrderItem().getProduct().getImages().isEmpty()) {
            img = request.getOrderItem().getProduct().getImages().get(0).getImageUrl();
        }
        response.setProductImage(img);

        response.setReason(request.getReason());
        response.setDescription(request.getDescription());
        response.setImageUrl(request.getImageUrl());
        response.setProofImageUrl(request.getProofImageUrl());
        response.setStatus(request.getStatus());
        response.setSellerRemarks(request.getSellerRemarks());
        response.setAdminComment(request.getAdminComment());
        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());
        return response;
    }
}
