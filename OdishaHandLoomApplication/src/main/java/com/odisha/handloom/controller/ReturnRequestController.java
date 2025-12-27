package com.odisha.handloom.controller;

import com.odisha.handloom.dto.ReturnRequestDTO;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.service.ReturnRequestService;
import com.odisha.handloom.security.jwt.JwtUtils;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/returns")
public class ReturnRequestController {

    @Autowired
    private ReturnRequestService returnRequestService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private User getUserFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Invalid Token");
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReturnRequestDTO.Response> createReturnRequest(
            @RequestBody ReturnRequestDTO.CreateRequest request,
            @RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        return ResponseEntity.ok(returnRequestService.createReturnRequest(user.getId(), request));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ReturnRequestDTO.Response>> getCustomerReturns(
            @RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        return ResponseEntity.ok(returnRequestService.getCustomerReturns(user.getId()));
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<ReturnRequestDTO.Response>> getSellerReturns(
            @RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        return ResponseEntity.ok(returnRequestService.getSellerReturns(user.getId()));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReturnRequestDTO.Response>> getAdminReturns() {
        return ResponseEntity.ok(returnRequestService.getAllReturnsForAdmin());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'SELLER', 'ADMIN')")
    public ResponseEntity<ReturnRequestDTO.Response> getReturnRequestById(@PathVariable UUID id) {
        return ResponseEntity.ok(returnRequestService.getReturnRequestById(id));
    }

    @PutMapping("/{id}/seller-decision")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ReturnRequestDTO.Response> updateSellerDecision(@PathVariable UUID id,
            @RequestBody ReturnRequestDTO.SellerDecision decision,
            @RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        return ResponseEntity.ok(returnRequestService.updateSellerDecision(user.getId(), id, decision));
    }

    @PutMapping("/{id}/admin-decision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReturnRequestDTO.Response> updateAdminDecision(@PathVariable UUID id,
            @RequestBody ReturnRequestDTO.AdminDecision decision) {
        return ResponseEntity.ok(returnRequestService.updateAdminDecision(id, decision));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> cancelReturnRequest(@PathVariable UUID id,
            @RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        returnRequestService.cancelReturnRequest(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
