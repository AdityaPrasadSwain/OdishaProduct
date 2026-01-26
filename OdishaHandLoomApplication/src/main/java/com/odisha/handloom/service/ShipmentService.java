package com.odisha.handloom.service;

import com.odisha.handloom.dto.shipment.ShipmentDto;

import com.odisha.handloom.enums.ShipmentStatus;
import java.util.List;
import java.util.UUID;

public interface ShipmentService {
    ShipmentDto createShipment(UUID orderId);

    ShipmentDto updateStatus(UUID shipmentId, ShipmentStatus status);

    ShipmentDto getShipmentById(UUID id);

    List<ShipmentDto> getAllShipments();
}
