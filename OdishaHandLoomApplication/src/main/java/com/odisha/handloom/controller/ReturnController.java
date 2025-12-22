package com.odisha.handloom.controller;

import com.odisha.handloom.entity.ReturnRequest;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.ReturnService;
import com.odisha.handloom.payload.response.MessageResponse; // Assuming this exists
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // For future use if image implementation changes to cloud

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ReturnController {

    @Autowired
    private ReturnService returnService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/returns")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createReturnRequest(
            @RequestParam("orderItemId") UUID orderItemId,
            @RequestParam("reason") String reason,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("type") ReturnRequest.ReturnType type,
            @RequestParam(value = "proofImage", required = false) MultipartFile proofImage // Placeholder for file logic
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User customer = userRepository.findByEmail(auth.getName()).orElseThrow();

        // In a real scenario, we would upload 'proofImage' to Cloudinary here and get
        // the URL.
        // For now, we will pass a placeholder URL or null if no image logic is
        // integrated yet in this specific controller step request.
        // The user requirement said "Optional image upload".
        String proofImageUrl = null;
        if (proofImage != null && !proofImage.isEmpty()) {
            // TODO: Integrate CloudinaryService here if available.
            // For now, setting a dummy valid string to indicate presence.
            proofImageUrl = "http://placeholder.com/image.jpg";
        }

        try {
            returnService.createReturnRequest(orderItemId, reason, description, type, proofImageUrl, customer.getId());
            return ResponseEntity.ok(new MessageResponse("Return request submitted successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/seller/returns")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public List<ReturnRequest> getSellerReturns() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User seller = userRepository.findByEmail(auth.getName()).orElseThrow();
        return returnService.getSellerReturnRequests(seller.getId());
    }

    @PutMapping("/seller/returns/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<?> processReturn(
            @PathVariable UUID id,
            @RequestParam("status") ReturnRequest.ReturnStatus status,
            @RequestParam(value = "remarks", required = false) String remarks) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User seller = userRepository.findByEmail(auth.getName()).orElseThrow();

        try {
            returnService.processReturnRequest(id, status, remarks, seller.getId());
            return ResponseEntity.ok(new MessageResponse("Return request updated successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
