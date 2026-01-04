package com.odisha.handloom.controller;

import com.odisha.handloom.logistics.service.DeliveryAgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.entity.Shipment;
import com.odisha.handloom.repository.UserRepository;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryVerificationController {

    @Autowired
    private DeliveryAgentService deliveryAgentService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/verify")
    @PreAuthorize("hasRole('DELIVERY_AGENT')")
    public ResponseEntity<?> verifyShipmentBarcode(
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            String shipmentIdStr = request.get("shipmentId");
            String scannedCode = request.get("scannedCode");

            if (shipmentIdStr == null || scannedCode == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            UUID shipmentId = UUID.fromString(shipmentIdStr);
            User agent = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Agent not found"));

            Shipment confirmedShipment = deliveryAgentService.verifyBarcode(shipmentId, scannedCode, agent.getId());

            return ResponseEntity.ok(confirmedShipment);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "System failure: " + e.getMessage()));
        }
    }
}
