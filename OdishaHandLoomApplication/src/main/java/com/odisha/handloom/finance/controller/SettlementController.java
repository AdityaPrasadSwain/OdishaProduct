package com.odisha.handloom.finance.controller;

import com.odisha.handloom.finance.entity.SellerSettlement;
import com.odisha.handloom.finance.service.SettlementService;
import com.odisha.handloom.finance.entity.PlatformWallet;
import com.odisha.handloom.finance.service.PlatformWalletService;
import com.odisha.handloom.entity.User;
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
@RequestMapping("/api/finance/settlement")
public class SettlementController {

    @Autowired
    private SettlementService settlementService;

    @Autowired
    private PlatformWalletService platformWalletService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.odisha.handloom.finance.repository.WalletTransactionRepository transactionRepository;

    @Autowired
    private com.odisha.handloom.logistics.repository.AgentEarningRepository agentEarningRepository;

    private User getAuthenticatedUser(UserDetails userDetails) {
        if (userDetails == null)
            return null;
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // --- Admin Endpoints ---

    @GetMapping("/admin/payouts")
    public ResponseEntity<List<SellerSettlement>> getAllSettlements() {
        return ResponseEntity.ok(settlementService.getAllSettlements());
    }

    @GetMapping("/admin/platform-wallet")
    public ResponseEntity<PlatformWallet> getPlatformWallet() {
        return ResponseEntity.ok(platformWalletService.getWallet());
    }

    @GetMapping("/admin/wallet/ledger")
    public ResponseEntity<List<com.odisha.handloom.finance.entity.WalletTransaction>> getWalletLedger() {
        UUID walletId = platformWalletService.getWallet().getId();
        return ResponseEntity.ok(transactionRepository.findByWalletIdOrderByCreatedAtDesc(walletId));
    }

    @PostMapping("/admin/payouts/{id}/pay")
    public ResponseEntity<?> approvePayout(@PathVariable UUID id, @RequestBody Map<String, String> payload) {
        String ref = payload.getOrDefault("transactionRef", "MANUAL-PAYOUT");
        return ResponseEntity.ok(settlementService.approvePayout(id, ref));
    }

    @PostMapping("/admin/payouts/{id}/hold")
    public ResponseEntity<?> holdSettlement(@PathVariable UUID id) {
        return ResponseEntity.ok(settlementService.holdSettlement(id));
    }

    @PostMapping("/admin/payouts/{id}/release")
    public ResponseEntity<?> releaseSettlement(@PathVariable UUID id) {
        return ResponseEntity.ok(settlementService.releaseSettlement(id));
    }

    // --- Seller Endpoints ---

    @GetMapping("/seller/payouts")
    public ResponseEntity<List<SellerSettlement>> getSellerSettlements(
            @AuthenticationPrincipal UserDetails userDetails) {
        User seller = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(settlementService.getSettlementsBySeller(seller.getId()));
    }

    // --- Agent Endpoints ---

    @GetMapping("/agent/finance/earnings")
    public ResponseEntity<List<com.odisha.handloom.logistics.entity.AgentEarning>> getMyEarnings(
            @AuthenticationPrincipal UserDetails userDetails) {
        User agent = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(agentEarningRepository.findByAgentId(agent.getId()));
    }
}
