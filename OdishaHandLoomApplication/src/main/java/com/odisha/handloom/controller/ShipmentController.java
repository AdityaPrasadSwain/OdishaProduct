package com.odisha.handloom.controller;

import com.odisha.handloom.dto.shipment.LocationUpdateDto;
import com.odisha.handloom.dto.shipment.ShipmentDto;
import com.odisha.handloom.enums.ShipmentStatus;
import com.odisha.handloom.service.ShipmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/logistics/shipments")
public class ShipmentController {

    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    // --- Admin Endpoints ---

    // Create Shipment (Usually triggered by System, but Admin can manually if
    // needed)
    @PostMapping("/admin/create")
    public ResponseEntity<ShipmentDto> createShipment(@RequestParam UUID orderId) {
        return ResponseEntity.ok(shipmentService.createShipment(orderId));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<ShipmentDto>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }

    // --- Agent Endpoints ---

    @PutMapping("/agent/update-status/{id}")
    public ResponseEntity<ShipmentDto> updateStatus(@PathVariable UUID id, @RequestParam ShipmentStatus status) {
        return ResponseEntity.ok(shipmentService.updateStatus(id, status));
    }

    // --- Public/Customer Endpoints ---

    @GetMapping("/track/{id}")
    public ResponseEntity<ShipmentDto> trackShipment(@PathVariable UUID id) {
        return ResponseEntity.ok(shipmentService.getShipmentById(id));
    }
}
