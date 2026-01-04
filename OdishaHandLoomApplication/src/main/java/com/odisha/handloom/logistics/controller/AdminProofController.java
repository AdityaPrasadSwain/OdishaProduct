package com.odisha.handloom.logistics.controller;

import com.odisha.handloom.enums.ProofRequestStatus;
import com.odisha.handloom.logistics.entity.DeliveryProof;
import com.odisha.handloom.logistics.entity.SellerProofRequest;
import com.odisha.handloom.logistics.service.ProofSharingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProofController {

    @Autowired
    private ProofSharingService proofService;

    @GetMapping("/proof-requests")
    public ResponseEntity<List<SellerProofRequest>> getAllRequests(@RequestParam(required = false) String status) {
        if ("PENDING".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(proofService.getPendingRequests());
        }
        return ResponseEntity.ok(proofService.getAllRequests());
    }

    @PutMapping("/proof-requests/{id}")
    public ResponseEntity<?> processRequest(@PathVariable UUID id,
            @RequestParam ProofRequestStatus status,
            @RequestParam(required = false) String comment) {
        try {
            SellerProofRequest updated = proofService.processRequest(id, status, comment);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/delivery-proofs")
    public ResponseEntity<List<DeliveryProof>> getAllProofs() {
        return ResponseEntity.ok(proofService.getAllProofs());
    }

    // Keep existing endpoint for backward compatibility if needed, or remove?
    // User said "Do NOT remove existing APIs", so I keep them or redirect.
    @GetMapping("/delivery-proof")
    public ResponseEntity<List<DeliveryProof>> getAllProofsLegacy() {
        return getAllProofs();
    }

    @GetMapping("/delivery-proof/{shipmentId}")
    public ResponseEntity<?> getProofByShipmentId(@PathVariable UUID shipmentId) {
        return proofService.getAdminProof(shipmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/delivery-proof/{shipmentId}")
    public ResponseEntity<?> uploadProof(@PathVariable UUID shipmentId, @RequestParam String imageUrl) {
        try {
            DeliveryProof proof = proofService.uploadProofAsAdmin(shipmentId, imageUrl);
            return ResponseEntity.ok(proof);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/proof-requests/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable UUID id) {
        try {
            SellerProofRequest updated = proofService.processRequest(id, ProofRequestStatus.APPROVED, null);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/proof-requests/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable UUID id, @RequestBody java.util.Map<String, String> payload) {
        try {
            String comment = payload.get("comment"); // Assuming JSON payload "comment"
            SellerProofRequest updated = proofService.processRequest(id, ProofRequestStatus.REJECTED, comment);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
