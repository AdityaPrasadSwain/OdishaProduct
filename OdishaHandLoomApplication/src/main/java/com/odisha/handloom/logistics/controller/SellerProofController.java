package com.odisha.handloom.logistics.controller;

import com.odisha.handloom.logistics.entity.SellerProofRequest;
import com.odisha.handloom.logistics.service.ProofSharingService;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import com.odisha.handloom.logistics.dto.SellerProofRequestDto;

@RestController
@RequestMapping("/api/seller")
@PreAuthorize("hasRole('SELLER')")
public class SellerProofController {

    @Autowired
    private ProofSharingService proofService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedSeller() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping("/proof-requests")
    public ResponseEntity<?> requestProof(@RequestBody SellerProofRequestDto requestDto) {
        User seller = getAuthenticatedSeller();
        try {
            SellerProofRequest request;
            if (requestDto.getOrderId() != null) {
                request = proofService.requestProofAccessByOrder(seller.getId(), requestDto.getOrderId(),
                        requestDto.getReason());
            } else {
                request = proofService.requestProofAccess(seller.getId(), requestDto.getShipmentId(),
                        requestDto.getReason());
            }

            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/proof-requests")
    public ResponseEntity<List<SellerProofRequest>> getMyRequests() {
        User seller = getAuthenticatedSeller();
        return ResponseEntity.ok(proofService.getSellerRequests(seller.getId()));
    }

    @GetMapping("/delivery-proof/{shipmentId}")
    public ResponseEntity<?> getProofUrl(@PathVariable UUID shipmentId) {
        User seller = getAuthenticatedSeller();
        try {
            String url = proofService.getProofUrlForSeller(seller.getId(), shipmentId);
            return ResponseEntity.ok(url); // Returns the Image URL directly or wrapped in object
        } catch (Exception e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/approved-proofs/{sellerId}")
    public ResponseEntity<List<com.odisha.handloom.logistics.dto.SellerApprovedProofDto>> getApprovedProofs(
            @PathVariable UUID sellerId) {
        User seller = getAuthenticatedSeller();
        if (!seller.getId().equals(sellerId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(proofService.getApprovedProofsForSeller(sellerId));
    }
}
