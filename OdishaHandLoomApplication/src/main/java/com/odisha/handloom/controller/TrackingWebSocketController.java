package com.odisha.handloom.controller;

import com.odisha.handloom.dto.shipment.LocationUpdateDto;
import com.odisha.handloom.service.ShipmentService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.UUID;

@Controller
public class TrackingWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ShipmentService shipmentService;

    public TrackingWebSocketController(SimpMessagingTemplate messagingTemplate, ShipmentService shipmentService) {
        this.messagingTemplate = messagingTemplate;
        this.shipmentService = shipmentService;
    }

    /**
     * Handle incoming location updates from Agents via WebSocket.
     * Destination: /app/track/{shipmentId}
     */
    @MessageMapping("/track/{shipmentId}")
    public void processLocationUpdate(@DestinationVariable UUID shipmentId, @Payload LocationUpdateDto locationDto) {

        // 1. Persist to DB
        shipmentService.updateLocation(shipmentId, locationDto);

        // 2. Broadcast to subscribers (Admin Dashboard / Customer Tracking Page)
        // Topic: /topic/track/{shipmentId}
        messagingTemplate.convertAndSend("/topic/track/" + shipmentId, locationDto);
    }
}
