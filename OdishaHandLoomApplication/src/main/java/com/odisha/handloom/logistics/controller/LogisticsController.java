package com.odisha.handloom.logistics.controller;

import com.odisha.handloom.logistics.dto.EarningRequest;
import com.odisha.handloom.logistics.dto.FailureRequest;
import com.odisha.handloom.logistics.dto.PaymentStatusRequest;
import com.odisha.handloom.logistics.entity.AgentEarning;
import com.odisha.handloom.logistics.entity.ShipmentPayment;
import com.odisha.handloom.logistics.service.LogisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/logistics")
@PreAuthorize("hasRole('DELIVERY_AGENT')")
public class LogisticsController {

    private final LogisticsService logisticsService;
    private final com.odisha.handloom.repository.UserRepository userRepository;

    public LogisticsController(LogisticsService logisticsService,
            com.odisha.handloom.repository.UserRepository userRepository) {
        this.logisticsService = logisticsService;
        this.userRepository = userRepository;
    }

    private UUID getAuthenticatedUserId(org.springframework.security.core.userdetails.UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @PostMapping("/shipments/{id}/payment/qr")
    public ResponseEntity<String> generateQr(@PathVariable UUID id,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        String qrData = logisticsService.generatePaymentQr(id, getAuthenticatedUserId(userDetails));
        return ResponseEntity.ok(qrData);
    }

    @PostMapping("/shipments/{id}/payment/status")
    public ResponseEntity<ShipmentPayment> recordPayment(@PathVariable UUID id,
            @RequestBody PaymentStatusRequest request,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        if ("SUCCESS".equalsIgnoreCase(request.getStatus())) {
            return ResponseEntity
                    .ok(logisticsService.recordPaymentSuccess(id, getAuthenticatedUserId(userDetails),
                            request.getTransactionRef()));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/shipments/{id}/earning")
    public ResponseEntity<AgentEarning> recordEarning(@PathVariable UUID id,
            @RequestBody EarningRequest request,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        return ResponseEntity
                .ok(logisticsService.calculateAndRecordEarning(id, getAuthenticatedUserId(userDetails),
                        request.getDistanceKm()));
    }

    @GetMapping("/agent/earnings")
    public ResponseEntity<List<AgentEarning>> getMyEarnings(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        return ResponseEntity.ok(logisticsService.getAgentEarnings(getAuthenticatedUserId(userDetails)));
    }

    @PostMapping("/shipments/{id}/fail")
    public ResponseEntity<Void> markFailed(@PathVariable UUID id,
            @RequestBody FailureRequest request,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        logisticsService.markDeliveryFailed(id, getAuthenticatedUserId(userDetails), request.getReason());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/shipments/{id}/location")
    public ResponseEntity<com.odisha.handloom.entity.Shipment> getLocation(@PathVariable UUID id) {
        return ResponseEntity.ok(logisticsService.getShipmentLocation(id));
    }

    @GetMapping("/agent/orders")
    public ResponseEntity<List<com.odisha.handloom.logistics.dto.AgentOrderDTO>> getAgentOrders(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        return ResponseEntity.ok(logisticsService.getAgentOrders(getAuthenticatedUserId(userDetails)));
    }

    @GetMapping("/agent/earnings/summary")
    public ResponseEntity<com.odisha.handloom.logistics.dto.AgentSummaryDTO> getMyDashboardSummary(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        return ResponseEntity.ok(logisticsService.getAgentSummary(getAuthenticatedUserId(userDetails)));
    }
}
