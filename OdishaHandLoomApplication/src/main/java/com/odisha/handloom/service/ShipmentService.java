package com.odisha.handloom.service;

import com.odisha.handloom.dto.shipment.ShipmentDto;
import com.odisha.handloom.dto.shipment.LocationUpdateDto;
import com.odisha.handloom.enums.ShipmentStatus;
import java.util.List;
import java.util.UUID;

public interface ShipmentService {
    ShipmentDto createShipment(UUID orderId);

    ShipmentDto assignAgent(UUID shipmentId, UUID agentId);

    ShipmentDto updateStatus(UUID shipmentId, ShipmentStatus status);

    void updateLocation(UUID shipmentId, LocationUpdateDto locationDto);

    ShipmentDto getShipmentById(UUID id);

    List<ShipmentDto> getShipmentsByAgent(UUID agentId);

    List<ShipmentDto> getAllShipments();
}
