package com.odisha.handloom.logistics.controller;

import com.odisha.handloom.entity.Order;
import com.odisha.handloom.logistics.config.ShiprocketConfig;
import com.odisha.handloom.logistics.dto.ShiprocketPickupRequest;
import com.odisha.handloom.logistics.service.ShiprocketOrderService;
import com.odisha.handloom.logistics.service.ShiprocketPickupService;
import com.odisha.handloom.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/shiprocket")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ShiprocketController {

    private final ShiprocketPickupService pickupService;
    private final ShiprocketOrderService orderService;
    private final OrderRepository orderRepository;
    private final ShiprocketConfig shiprocketConfig;

    @PostMapping("/pickup")
    public ResponseEntity<Map<String, Object>> addPickupLocation(@RequestBody ShiprocketPickupRequest request) {
        return ResponseEntity.ok(pickupService.addPickupLocation(request));
    }

    @GetMapping("/pickup")
    public ResponseEntity<Map<String, Object>> getPickupLocations() {
        return ResponseEntity.ok(pickupService.getPickupLocations());
    }

    // Order Management
    @PostMapping("/orders/sync/{orderId}")
    public ResponseEntity<String> syncOrderToShiprocket(@PathVariable UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        orderService.createOrderInShiprocket(order);
        return ResponseEntity.ok("Order synced to Shiprocket successfully");
    }

    @PostMapping("/orders/label/{shipmentId}")
    public ResponseEntity<String> generateLabel(@PathVariable String shipmentId) {
        String url = orderService.generateLabel(shipmentId);
        return ResponseEntity.ok(url);
    }

    @GetMapping("/orders/track/{awb}")
    public ResponseEntity<Map<String, Object>> trackShipment(@PathVariable String awb) {
        return ResponseEntity.ok(orderService.trackShipment(awb));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody Map<String, Object> payload,
            @RequestHeader(value = "x-shiprocket-signature", required = false) String signature) {
        // TODO: Verify signature using shiprocketConfig.getWebhookSecret()
        // For now, we trust the payload or just log.
        log.info("Received Webhook: {}", payload);

        orderService.updateOrderStatusFromWebhook(payload);
        return ResponseEntity.ok("Webhook processed");
    }
}
