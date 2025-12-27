package com.odisha.handloom.controller;

import com.odisha.handloom.entity.*;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/seller-verification")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSellerVerificationController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    SellerDocumentsRepository docsRepository;

    @Autowired
    SellerBankDetailsRepository bankRepository;

    @Autowired
    AdminActionLogRepository logRepository;

    @Autowired
    SellerNoteRepository noteRepository;

    @GetMapping("/sellers")
    public ResponseEntity<List<User>> getAllSellers(@RequestParam(required = false) RegistrationStatus status) {
        List<User> sellers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.SELLER)
                .filter(u -> status == null || u.getRegistrationStatus() == status)
                .collect(Collectors.toList());
        return ResponseEntity.ok(sellers);
    }

    @GetMapping("/sellers/{id}")
    public ResponseEntity<?> getSellerDetails(@PathVariable UUID id) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Seller not found"));

        Optional<SellerDocuments> docs = docsRepository.findBySeller(seller);
        Optional<SellerBankDetails> bank = bankRepository.findBySeller(seller);
        List<AdminActionLog> logs = logRepository.findBySellerIdOrderByCreatedAtDesc(id);
        List<SellerNote> notes = noteRepository.findBySellerIdOrderByCreatedAtDesc(id);

        Map<String, Object> response = new HashMap<>();
        response.put("seller", seller);
        response.put("documents", docs.orElse(null));
        response.put("bankDetails", bank.orElse(null));
        response.put("logs", logs);
        response.put("notes", notes);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/verify-documents")
    public ResponseEntity<?> verifyDocuments(@PathVariable UUID id, Authentication auth) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Seller not found"));
        SellerDocuments docs = docsRepository.findBySeller(seller)
                .orElseThrow(() -> new RuntimeException("Docs not found"));

        docs.setVerified(true);
        docs.setVerifiedAt(java.time.LocalDateTime.now());
        docsRepository.save(docs);

        seller.setRegistrationStatus(RegistrationStatus.PENDING_BANK);
        userRepository.save(seller);

        logAction(auth, id, "VERIFY_DOCS", "Documents Verified");

        return ResponseEntity.ok(new MessageResponse("Documents verified. Status: PENDING_BANK"));
    }

    @PostMapping("/{id}/reject-documents")
    public ResponseEntity<?> rejectDocuments(@PathVariable UUID id, @RequestBody Map<String, String> payload,
            Authentication auth) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Seller not found"));
        String reason = payload.get("reason");

        seller.setRegistrationStatus(RegistrationStatus.DOCUMENTS_REJECTED);
        userRepository.save(seller);

        logAction(auth, id, "REJECT_DOCS", reason);

        return ResponseEntity.ok(new MessageResponse("Documents rejected. Status: DOCUMENTS_REJECTED"));
    }

    @PostMapping("/{id}/verify-bank")
    public ResponseEntity<?> verifyBank(@PathVariable UUID id, Authentication auth) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Seller not found"));
        SellerBankDetails bank = bankRepository.findBySeller(seller)
                .orElseThrow(() -> new RuntimeException("Bank details not found"));

        bank.setVerified(true);
        bank.setVerifiedAt(java.time.LocalDateTime.now());
        bankRepository.save(bank);

        seller.setRegistrationStatus(RegistrationStatus.APPROVED);
        seller.setApproved(true);
        userRepository.save(seller);

        logAction(auth, id, "VERIFY_BANK", "Bank Details Verified. Seller Approved.");

        return ResponseEntity.ok(new MessageResponse("Bank verified. Status: APPROVED"));
    }

    @PostMapping("/{id}/reject-bank")
    public ResponseEntity<?> rejectBank(@PathVariable UUID id, @RequestBody Map<String, String> payload,
            Authentication auth) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Seller not found"));
        String reason = payload.get("reason");

        seller.setRegistrationStatus(RegistrationStatus.BANK_REJECTED);
        userRepository.save(seller);

        logAction(auth, id, "REJECT_BANK", reason);

        return ResponseEntity.ok(new MessageResponse("Bank details rejected. Status: BANK_REJECTED"));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveSeller(@PathVariable UUID id, Authentication auth) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Seller not found"));
        seller.setRegistrationStatus(RegistrationStatus.APPROVED);
        seller.setApproved(true);
        userRepository.save(seller);

        logAction(auth, id, "APPROVE_SELLER", "Manual Final Approval");
        return ResponseEntity.ok(new MessageResponse("Seller Approved"));
    }

    @PostMapping("/{id}/suspend")
    public ResponseEntity<?> suspendSeller(@PathVariable UUID id, @RequestBody Map<String, String> payload,
            Authentication auth) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Seller not found"));
        String reason = payload.get("reason");

        seller.setRegistrationStatus(RegistrationStatus.SUSPENDED);
        seller.setBlocked(true);
        userRepository.save(seller);

        logAction(auth, id, "SUSPEND_SELLER", reason);
        return ResponseEntity.ok(new MessageResponse("Seller Suspended"));
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<?> activateSeller(@PathVariable UUID id, Authentication auth) {
        User seller = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Seller not found"));

        seller.setRegistrationStatus(RegistrationStatus.APPROVED);
        seller.setBlocked(false);
        userRepository.save(seller);

        logAction(auth, id, "ACTIVATE_SELLER", "Re-activated seller account");
        return ResponseEntity.ok(new MessageResponse("Seller Activated"));
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<?> addNote(@PathVariable UUID id, @RequestBody Map<String, String> payload,
            Authentication auth) {
        String content = payload.get("note");
        User admin = userRepository.findByEmail(auth.getName()).orElseThrow();

        SellerNote note = new SellerNote();
        note.setSellerId(id);
        note.setAdminId(admin.getId());
        note.setNote(content);
        noteRepository.save(note);

        return ResponseEntity.ok(new MessageResponse("Note added"));
    }

    private void logAction(Authentication auth, UUID sellerId, String action, String reason) {
        User admin = userRepository.findByEmail(auth.getName()).orElseThrow(); // Assuming admin is logged in
        AdminActionLog log = new AdminActionLog();
        log.setAdminId(admin.getId());
        log.setSellerId(sellerId);
        log.setActionType(action);
        log.setReason(reason);
        logRepository.save(log);
    }
}
