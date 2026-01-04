package com.odisha.handloom.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "location_history")
public class LocationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "shipment_id", nullable = false)
    private Shipment shipment;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public LocationHistory() {
    }

    public LocationHistory(UUID id, Shipment shipment, Double latitude, Double longitude, LocalDateTime timestamp) {
        this.id = id;
        this.shipment = shipment;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }

    public static LocationHistoryBuilder builder() {
        return new LocationHistoryBuilder();
    }

    public static class LocationHistoryBuilder {
        private UUID id;
        private Shipment shipment;
        private Double latitude;
        private Double longitude;
        private LocalDateTime timestamp;

        LocationHistoryBuilder() {
        }

        public LocationHistoryBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public LocationHistoryBuilder shipment(Shipment shipment) {
            this.shipment = shipment;
            return this;
        }

        public LocationHistoryBuilder latitude(Double latitude) {
            this.latitude = latitude;
            return this;
        }

        public LocationHistoryBuilder longitude(Double longitude) {
            this.longitude = longitude;
            return this;
        }

        public LocationHistoryBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public LocationHistory build() {
            return new LocationHistory(id, shipment, latitude, longitude, timestamp);
        }
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Shipment getShipment() {
        return shipment;
    }

    public void setShipment(Shipment shipment) {
        this.shipment = shipment;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
