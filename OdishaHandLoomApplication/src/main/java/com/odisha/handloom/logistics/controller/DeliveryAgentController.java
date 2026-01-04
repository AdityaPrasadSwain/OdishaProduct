package com.odisha.handloom.logistics.controller;

import com.odisha.handloom.entity.Shipment;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.logistics.entity.AgentBankDetails;
import com.odisha.handloom.logistics.entity.AgentEarning;
import com.odisha.handloom.logistics.service.AgentPaymentService;
import com.odisha.handloom.logistics.service.DeliveryAgentService;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/logistics/agent/account")
public class DeliveryAgentController {

    @Autowired
    private DeliveryAgentService deliveryAgentService;

    @Autowired
    private AgentPaymentService agentPaymentService;

    @Autowired
    private com.odisha.handloom.logistics.service.LogisticsService logisticsService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/verify-barcode")
    public ResponseEntity<?> verifyBarcode(@RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal UserDetails userDetails) {
        User agent = getAuthenticatedUser(userDetails);
        UUID shipmentId = UUID.fromString((String) payload.get("shipmentId"));
        String barcode = (String) payload.get("barcode");

        Shipment shipment = deliveryAgentService.verifyBarcode(shipmentId, barcode, agent.getId());
        return ResponseEntity.ok(Map.of("message", "Barcode verified", "verified", true));
    }

    @PostMapping("/upload-proof")
    public ResponseEntity<?> uploadProof(
            @RequestParam("shipmentId") UUID shipmentId,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        User agent = getAuthenticatedUser(userDetails);
        com.odisha.handloom.logistics.entity.DeliveryProof proof = logisticsService.uploadProof(shipmentId,
                agent.getId(), file);
        return ResponseEntity.ok(proof);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal UserDetails userDetails) {
        User agent = getAuthenticatedUser(userDetails);
        UUID shipmentId = UUID.fromString((String) payload.get("shipmentId"));

        deliveryAgentService.sendDeliveryOtp(shipmentId, agent.getId());
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, Object> payload,
            @AuthenticationPrincipal UserDetails userDetails) {
        User agent = getAuthenticatedUser(userDetails);
        UUID shipmentId = UUID.fromString((String) payload.get("shipmentId"));
        String otp = (String) payload.get("otp");

        deliveryAgentService.verifyDeliveryOtp(shipmentId, otp, agent.getId());
        return ResponseEntity.ok(Map.of("message", "Delivery completed successfully"));
    }

    @GetMapping("/earnings")
    public ResponseEntity<List<AgentEarning>> getEarnings(@AuthenticationPrincipal UserDetails userDetails) {
        User agent = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(agentPaymentService.getAgentEarnings(agent.getId()));
    }

    @GetMapping("/bank-details")
    public ResponseEntity<AgentBankDetails> getBankDetails(@AuthenticationPrincipal UserDetails userDetails) {
        User agent = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(agentPaymentService.getBankDetails(agent.getId()));
    }

    @PostMapping("/bank-details")
    public ResponseEntity<AgentBankDetails> updateBankDetails(@RequestBody AgentBankDetails details,
            @AuthenticationPrincipal UserDetails userDetails) {
        User agent = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(agentPaymentService.saveBankDetails(agent.getId(), details));
    }

    @Autowired
    private com.odisha.handloom.logistics.service.ProofSharingService proofSharingService;

    @GetMapping("/delivery-proof")
    public ResponseEntity<?> getMyProofs(@AuthenticationPrincipal UserDetails userDetails) {
        User agent = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(proofSharingService.getAgentProofs(agent.getId()));
    }
}
