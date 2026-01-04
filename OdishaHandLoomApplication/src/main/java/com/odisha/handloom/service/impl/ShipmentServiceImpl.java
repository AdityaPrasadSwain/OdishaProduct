package com.odisha.handloom.service.impl;

import com.odisha.handloom.dto.shipment.LocationUpdateDto;
import com.odisha.handloom.dto.shipment.ShipmentDto;
import com.odisha.handloom.entity.*;
import com.odisha.handloom.repository.ShipmentBarcodeRepository; // New Import
import com.odisha.handloom.entity.Role;
import com.odisha.handloom.enums.ShipmentStatus;
import com.odisha.handloom.repository.LocationHistoryRepository;
import com.odisha.handloom.repository.OrderRepository;
import com.odisha.handloom.repository.ShipmentRepository;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.ShipmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final LocationHistoryRepository locationHistoryRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ShipmentBarcodeRepository shipmentBarcodeRepository;

    public ShipmentServiceImpl(ShipmentRepository shipmentRepository,
            LocationHistoryRepository locationHistoryRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            ShipmentBarcodeRepository shipmentBarcodeRepository) {
        this.shipmentRepository = shipmentRepository;
        this.locationHistoryRepository = locationHistoryRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.shipmentBarcodeRepository = shipmentBarcodeRepository;
    }

    @Override
    @Transactional
    public ShipmentDto createShipment(UUID orderId) {
        if (shipmentRepository.findByOrder_Id(orderId).isPresent()) {
            throw new RuntimeException("Shipment already exists for this order");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Generate Tracking ID (8 chars)
        String trackingId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String barcodeValue = "UDR|SHIP|" + trackingId;

        // Update Order with Tracking ID
        order.setTrackingId(trackingId);
        orderRepository.save(order);

        Shipment shipment = Shipment.builder()
                .order(order)
                .status(ShipmentStatus.CREATED)
                .estimatedDelivery(LocalDateTime.now().plusDays(5)) // Default estimate
                .barcodeValue(barcodeValue) // Deprecated field but keeping for consistency
                .build();

        shipment = shipmentRepository.save(shipment);

        // Save to new table
        ShipmentBarcode barcode = new ShipmentBarcode(shipment.getId(), trackingId, barcodeValue);
        shipmentBarcodeRepository.save(barcode);

        // Log History
        // History logging disabled for stability
        // saveHistory(shipment, ShipmentStatus.CREATED, "Shipment created");

        return mapToDto(shipment);
    }

    @Override
    @Transactional
    public ShipmentDto assignAgent(UUID shipmentId, UUID agentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (!agent.getRole().equals(Role.DELIVERY_AGENT)) {
            throw new RuntimeException("User is not a delivery agent");
        }

        shipment.setAgent(agent);
        shipment.setStatus(ShipmentStatus.ASSIGNED);
        shipment = shipmentRepository.save(shipment);

        return mapToDto(shipment);
    }

    @Override
    @Transactional
    public ShipmentDto updateStatus(UUID shipmentId, ShipmentStatus status) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        shipment.setStatus(status);
        if (status == ShipmentStatus.DELIVERED) {
            // Future: Close Order logic here or via listener
        }
        shipment = shipmentRepository.save(shipment);

        // Log History
        // History logging disabled for stability
        // saveHistory(shipment, status, "Status updated to " + status);

        return mapToDto(shipment);
    }

    @Override
    @Transactional
    public void updateLocation(UUID shipmentId, LocationUpdateDto locationDto) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        shipment.setCurrentLatitude(locationDto.getLatitude());
        shipment.setCurrentLongitude(locationDto.getLongitude());

        // Save history
        LocationHistory history = LocationHistory.builder()
                .shipment(shipment)
                .latitude(locationDto.getLatitude())
                .longitude(locationDto.getLongitude())
                .timestamp(LocalDateTime.now())
                .build();

        locationHistoryRepository.save(history);
        shipmentRepository.save(shipment);
    }

    @Override
    public ShipmentDto getShipmentById(UUID id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        return mapToDto(shipment);
    }

    @Override
    public List<ShipmentDto> getShipmentsByAgent(UUID agentId) {
        return shipmentRepository.findByAgentId(agentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShipmentDto> getAllShipments() {
        return shipmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ShipmentDto mapToDto(Shipment s) {
        ShipmentDto.ShipmentDtoBuilder builder = ShipmentDto.builder()
                .id(s.getId())
                .orderId(s.getOrder().getId())
                .status(s.getStatus().name())
                .currentLatitude(s.getCurrentLatitude())
                .currentLongitude(s.getCurrentLongitude())
                .estimatedDelivery(s.getEstimatedDelivery())
                .updatedAt(s.getUpdatedAt())
                .shippingAddress(s.getOrder().getShippingAddress())
                .customerName(s.getOrder().getUser().getFullName())
                .customerPhone(s.getOrder().getUser().getPhoneNumber());

        if (s.getAgent() != null) {
            builder.agentId(s.getAgent().getId())
                    .agentName(s.getAgent().getFullName())
                    .agentPhone(s.getAgent().getPhoneNumber());
        }

        return builder.build();
    }
}
