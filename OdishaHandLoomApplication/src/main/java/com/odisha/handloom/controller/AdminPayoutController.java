package com.odisha.handloom.controller;

import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.service.SellerPayoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/payouts")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPayoutController {

    @Autowired
    private SellerPayoutService payoutService;

    @GetMapping("/bank-details")
    public List<com.odisha.handloom.payload.dto.SellerPayoutDTO> getAllSellerBankDetails() {
        return payoutService.getAllSellerBankDetails();
    }

    @PutMapping("/bank-details/{id}/verify")
    public ResponseEntity<?> verifyBankDetails(@PathVariable UUID id) {
        payoutService.verifyBankDetails(id, true);
        return ResponseEntity.ok(new MessageResponse("Bank details verified successfully!"));
    }

    @PutMapping("/bank-details/{id}/reject")
    public ResponseEntity<?> rejectBankDetails(@PathVariable UUID id) {
        payoutService.verifyBankDetails(id, false);
        return ResponseEntity.ok(new MessageResponse("Bank details rejected (unverified)."));
    }

    @PostMapping("/initiate/{sellerId}")
    public ResponseEntity<?> initiatePayout(@PathVariable UUID sellerId) {
        try {
            payoutService.initiatePayout(sellerId);
            return ResponseEntity.ok(new MessageResponse("Payout initiated and processed successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
