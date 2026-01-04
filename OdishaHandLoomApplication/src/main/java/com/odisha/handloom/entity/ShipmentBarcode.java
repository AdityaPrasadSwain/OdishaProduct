package com.odisha.handloom.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "shipments_barcodes")
public class ShipmentBarcode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID shipmentId;

    @Column(nullable = false)
    private String trackingId;

    @Column(nullable = false, unique = true)
    private String barcodeValue;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @CreationTimestamp
    private LocalDateTime createdAt;

    public ShipmentBarcode() {
    }

    public ShipmentBarcode(UUID shipmentId, String trackingId, String barcodeValue) {
        this.shipmentId = shipmentId;
        this.trackingId = trackingId;
        this.barcodeValue = barcodeValue;
        this.status = "ACTIVE";
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getShipmentId() {
        return shipmentId;
    }

    public void setShipmentId(UUID shipmentId) {
        this.shipmentId = shipmentId;
    }

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public String getBarcodeValue() {
        return barcodeValue;
    }

    public void setBarcodeValue(String barcodeValue) {
        this.barcodeValue = barcodeValue;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
