package com.odisha.handloom.logistics.controller;

import com.odisha.handloom.logistics.entity.DeliveryProof;
import com.odisha.handloom.logistics.service.DeliveryProofService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/agent/proof")
@PreAuthorize("hasRole('DELIVERY_AGENT')")
public class AgentProofController {

    @Autowired
    private DeliveryProofService proofService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadProof(
            @RequestParam("orderId") UUID orderId,
            @RequestParam("agentId") UUID agentId,
            @RequestParam("file") MultipartFile file) {

        try {
            DeliveryProof proof = proofService.uploadProof(orderId, agentId, file);
            return ResponseEntity.ok(proof);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
