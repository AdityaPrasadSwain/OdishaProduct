package com.odisha.handloom.controller;

import com.odisha.handloom.dto.kyc.*;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.kyc.SellerKycService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/seller/kyc")
public class SellerKycController {

    @Autowired
    private SellerKycService sellerKycService;

    @Autowired
    private UserRepository userRepository;

    private UUID getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) auth.getPrincipal()).getUsername();
            return userRepository.findByEmail(email)
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Unauthorized");
    }

    @GetMapping("/status")
    public ResponseEntity<SellerKycResponse> getStatus() {
        return ResponseEntity.ok(sellerKycService.getKycStatus(getAuthenticatedUserId()));
    }

    @PostMapping("/pan/verify")
    public ResponseEntity<SellerKycResponse> verifyPan(@RequestBody PanVerifyRequest request) {
        return ResponseEntity.ok(sellerKycService.verifyPan(getAuthenticatedUserId(), request));
    }

    @PostMapping("/aadhaar/send-otp")
    public ResponseEntity<String> sendAadhaarOtp(@RequestBody AadhaarOtpRequest request) {
        return ResponseEntity.ok(sellerKycService.sendAadhaarOtp(getAuthenticatedUserId(), request));
    }

    @PostMapping("/aadhaar/verify-otp")
    public ResponseEntity<SellerKycResponse> verifyAadhaarOtp(@RequestBody AadhaarVerifyRequest request) {
        return ResponseEntity.ok(sellerKycService.verifyAadhaarOtp(getAuthenticatedUserId(), request));
    }

    @PostMapping("/gst/verify")
    public ResponseEntity<SellerKycResponse> verifyGst(@RequestBody GstVerifyRequest request) {
        return ResponseEntity.ok(sellerKycService.verifyGst(getAuthenticatedUserId(), request));
    }

    @PostMapping("/submit")
    public ResponseEntity<SellerKycResponse> submit() {
        return ResponseEntity.ok(sellerKycService.submitForApproval(getAuthenticatedUserId()));
    }
}
