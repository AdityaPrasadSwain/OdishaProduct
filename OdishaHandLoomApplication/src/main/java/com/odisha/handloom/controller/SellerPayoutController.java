package com.odisha.handloom.controller;

import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.request.BankDetailsRequest;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.SellerPayoutService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/seller/payouts")
@PreAuthorize("hasRole('SELLER')")
public class SellerPayoutController {

    @Autowired
    private SellerPayoutService payoutService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/bank-details")
    public ResponseEntity<?> addOrUpdateBankDetails(@Valid @RequestBody BankDetailsRequest request) {
        User seller = getAuthenticatedSeller();
        User details = payoutService.addOrUpdateBankDetails(seller.getId(), request);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/bank-details")
    public ResponseEntity<?> getBankDetails() {
        User seller = getAuthenticatedSeller();
        User details = payoutService.getBankDetails(seller.getId());
        return ResponseEntity.ok(details);
    }

    @GetMapping("/wallet")
    public ResponseEntity<?> getWalletOverview() {
        User seller = getAuthenticatedSeller();
        return ResponseEntity.ok(payoutService.getWalletOverview(seller.getId()));
    }

    @PostMapping("/initiate")
    public ResponseEntity<?> initiatePayout() {
        User seller = getAuthenticatedSeller();
        try {
            return ResponseEntity.ok(payoutService.initiatePayout(seller.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private User getAuthenticatedSeller() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return userRepository.findByEmail(currentPrincipalName)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
    }
}
