package com.odisha.handloom.logistics.controller;

import com.odisha.handloom.logistics.service.LogisticsService;
import com.odisha.handloom.logistics.entity.DeliveryProof;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    @Autowired
    private LogisticsService logisticsService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping(value = "/upload-proof", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('DELIVERY_AGENT')")
    public ResponseEntity<?> uploadProof(
            @RequestParam("orderId") UUID orderId, // Accepting orderId as per requirement, though ShipmentId is usually
                                                   // preferred, we can look it up
            @RequestParam(value = "remarks", required = false) String remarks,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {

        User agent = getAuthenticatedUser(userDetails);

        // Requirement says input is orderId. LogisticsService.uploadProof takes
        // shipmentId.
        // We might need to find shipment by orderId or overload uploadProof.
        // For now, assuming the customized flow handles this lookup or we add a service
        // method.
        // To be safe, let's lookup shipment by orderId in the service layer?
        // Or if the user sends shipmentId as 'orderId' (common confusion), strictly
        // following req: "orderId"

        // However, the database `delivery_proof` has both `shipment_id` and `order_id`.
        // Let's create a specific method in LogisticsService for this flow if needed,
        // or reuse.
        // existing: uploadProof(UUID shipmentId, UUID agentId, MultipartFile file)

        // Let's assume for this strict requirement, we'll implement a wrapper or lookup
        // here or in service.
        // Given I cannot easily change the Interface significantly without seeing all
        // impls,
        // I will do the lookup here if possible, or add a method to LogisticsService.

        // But wait, the existing uploadProof uses shipmentId.
        // I will assume the frontend might send shipmentId OR I need to look it up.
        // Req says: "Request: orderId". I will respect that.
        // I need to find the shipment for this order.

        // Since I don't have ShipmentRepository injected here, I should probably
        // delegate to Service.
        // I'll call a new method `uploadProofByOrder` in LogisticsService/Impl or
        // manually lookup.

        // Let's modify LogisticsService to accept OrderId if possible or just use
        // existing if I can.
        // Actually, I can inject ShipmentRepository here too, but better to keep logic
        // in Service.
        // I will add `uploadProofForOrder` to LogisticsService.

        try {
            DeliveryProof proof = logisticsService.uploadProofByOrder(orderId, agent.getId(), remarks, file);
            return ResponseEntity.ok(Map.of(
                    "proofId", proof.getId(),
                    "orderId", proof.getOrderId(), // Ensure this exists
                    "agentId", proof.getAgentId(),
                    "fileUrl", proof.getImageUrl(),
                    "remarks", (remarks != null ? remarks : ""),
                    "uploadedAt", proof.getUploadedAt()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
