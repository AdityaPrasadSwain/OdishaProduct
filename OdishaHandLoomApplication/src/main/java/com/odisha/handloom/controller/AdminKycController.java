package com.odisha.handloom.controller;

import com.odisha.handloom.service.kyc.AdminKycService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/kyc")
@PreAuthorize("hasRole('ADMIN')")
public class AdminKycController {

    @Autowired
    private AdminKycService adminKycService;

    @PostMapping("/{kycId}/approve")
    public ResponseEntity<String> approve(@PathVariable UUID kycId) {
        adminKycService.approveSeller(kycId);
        return ResponseEntity.ok("Seller Approved");
    }

    @PostMapping("/{kycId}/reject")
    public ResponseEntity<String> reject(@PathVariable UUID kycId, @RequestParam String reason) {
        adminKycService.rejectSeller(kycId, reason);
        return ResponseEntity.ok("Seller Rejected");
    }
}
