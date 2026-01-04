package com.odisha.handloom.logistics.controller;

import com.odisha.handloom.logistics.entity.AgentEarning;
import com.odisha.handloom.logistics.service.AgentPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/logistics/agent-earnings")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
public class AdminAgentPaymentController {

    @Autowired
    private AgentPaymentService agentPaymentService;

    @GetMapping
    public ResponseEntity<List<AgentEarning>> getAllEarnings() {
        return ResponseEntity.ok(agentPaymentService.getAllEarnings());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<AgentEarning>> getPendingPayouts() {
        return ResponseEntity.ok(agentPaymentService.getPendingEarnings());
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<?> payEarning(@PathVariable UUID id, @RequestBody java.util.Map<String, String> request) {
        String transactionRef = request.get("transactionRef");
        agentPaymentService.payEarning(id, transactionRef);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/approve-batch")
    public ResponseEntity<?> approvePayouts(@RequestBody List<UUID> earningIds) {
        agentPaymentService.markEarningsPaid(earningIds);
        return ResponseEntity.ok().build();
    }
}
