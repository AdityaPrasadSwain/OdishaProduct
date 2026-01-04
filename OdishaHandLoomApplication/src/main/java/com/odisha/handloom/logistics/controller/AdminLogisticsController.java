package com.odisha.handloom.logistics.controller;

import com.odisha.handloom.entity.Role;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.logistics.service.LogisticsService;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/logistics")
@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
public class AdminLogisticsController {

    private final LogisticsService logisticsService;
    private final UserRepository userRepository;

    public AdminLogisticsController(LogisticsService logisticsService, UserRepository userRepository) {
        this.logisticsService = logisticsService;
        this.userRepository = userRepository;
    }

    @GetMapping("/agents")
    public ResponseEntity<List<User>> getDeliveryAgents() {
        return ResponseEntity.ok(userRepository.findByRole(Role.DELIVERY_AGENT));
    }

    @PostMapping("/shipments/{id}/assign")
    public ResponseEntity<Void> assignAgent(@PathVariable UUID id, @RequestParam UUID agentId) {
        logisticsService.assignAgent(id, agentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/shipments/{id}/dispatch")
    public ResponseEntity<Void> dispatchShipment(@PathVariable UUID id) {
        logisticsService.dispatchShipment(id);
        return ResponseEntity.ok().build();
    }
}
