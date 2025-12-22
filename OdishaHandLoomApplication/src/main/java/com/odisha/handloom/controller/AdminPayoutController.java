package com.odisha.handloom.controller;

import com.odisha.handloom.entity.User;
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
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPayoutController {

    @Autowired
    private SellerPayoutService payoutService;

    @GetMapping("/seller-bank-details")
    public List<User> getAllSellerBankDetails() {
        return payoutService.getAllSellerBankDetails();
    }

    @PutMapping("/seller-bank-details/{id}/verify")
    public ResponseEntity<?> verifyBankDetails(@PathVariable UUID id) {
        payoutService.verifyBankDetails(id, true);
        return ResponseEntity.ok(new MessageResponse("Bank details verified successfully!"));
    }

    @PutMapping("/seller-bank-details/{id}/reject")
    public ResponseEntity<?> rejectBankDetails(@PathVariable UUID id) {
        payoutService.verifyBankDetails(id, false);
        return ResponseEntity.ok(new MessageResponse("Bank details rejected (unverified)."));
    }

    @PostMapping("/payouts/initiate/{sellerId}")
    public ResponseEntity<?> initiatePayout(@PathVariable UUID sellerId) {
        try {
            payoutService.initiatePayout(sellerId);
            return ResponseEntity.ok(new MessageResponse("Payout initiated and processed successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
