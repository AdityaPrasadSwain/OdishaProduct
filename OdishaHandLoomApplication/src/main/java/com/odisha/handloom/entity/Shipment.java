package com.odisha.handloom.entity;

import com.odisha.handloom.enums.ShipmentStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "shipments")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status;

    // Current Live Location (of the package/agent)
    private Double currentLatitude;
    private Double currentLongitude;

    // Static Locations
    private Double shippingLatitude;
    private Double shippingLongitude;
    private Double sellerLatitude;
    private Double sellerLongitude;

    private LocalDateTime estimatedDelivery;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Barcode Security
    @Column(name = "barcode_value", unique = true)
    private String barcodeValue;

    @Column(name = "barcode_verified", nullable = false)
    private Boolean barcodeVerified = false;

    public Shipment() {
    }

    public Shipment(UUID id, Order order, User agent, ShipmentStatus status, Double currentLatitude,
            Double currentLongitude, LocalDateTime estimatedDelivery, LocalDateTime createdAt,
            LocalDateTime updatedAt, String barcodeValue, Boolean barcodeVerified) {
        this.id = id;
        this.order = order;
        this.agent = agent;
        this.status = status;
        this.currentLatitude = currentLatitude;
        this.currentLongitude = currentLongitude;
        this.estimatedDelivery = estimatedDelivery;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.barcodeValue = barcodeValue;
        this.barcodeVerified = barcodeVerified;
    }

    public static ShipmentBuilder builder() {
        return new ShipmentBuilder();
    }

    public static class ShipmentBuilder {
        private UUID id;
        private Order order;
        private User agent;
        private ShipmentStatus status;
        private Double currentLatitude;
        private Double currentLongitude;
        private LocalDateTime estimatedDelivery;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String barcodeValue;
        private Boolean barcodeVerified;

        ShipmentBuilder() {
        }

        public ShipmentBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public ShipmentBuilder order(Order order) {
            this.order = order;
            return this;
        }

        public ShipmentBuilder agent(User agent) {
            this.agent = agent;
            return this;
        }

        public ShipmentBuilder status(ShipmentStatus status) {
            this.status = status;
            return this;
        }

        public ShipmentBuilder currentLatitude(Double currentLatitude) {
            this.currentLatitude = currentLatitude;
            return this;
        }

        public ShipmentBuilder currentLongitude(Double currentLongitude) {
            this.currentLongitude = currentLongitude;
            return this;
        }

        public ShipmentBuilder estimatedDelivery(LocalDateTime estimatedDelivery) {
            this.estimatedDelivery = estimatedDelivery;
            return this;
        }

        public ShipmentBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ShipmentBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public ShipmentBuilder barcodeValue(String barcodeValue) {
            this.barcodeValue = barcodeValue;
            return this;
        }

        public ShipmentBuilder barcodeVerified(Boolean barcodeVerified) {
            this.barcodeVerified = barcodeVerified;
            return this;
        }

        public Shipment build() {
            return new Shipment(id, order, agent, status, currentLatitude, currentLongitude, estimatedDelivery,
                    createdAt, updatedAt, barcodeValue, barcodeVerified);
        }
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public User getAgent() {
        return agent;
    }

    public void setAgent(User agent) {
        this.agent = agent;
    }

    public ShipmentStatus getStatus() {
        return status;
    }

    public void setStatus(ShipmentStatus status) {
        this.status = status;
    }

    public Double getCurrentLatitude() {
        return currentLatitude;
    }

    public void setCurrentLatitude(Double currentLatitude) {
        this.currentLatitude = currentLatitude;
    }

    public Double getCurrentLongitude() {
        return currentLongitude;
    }

    public void setCurrentLongitude(Double currentLongitude) {
        this.currentLongitude = currentLongitude;
    }

    public LocalDateTime getEstimatedDelivery() {
        return estimatedDelivery;
    }

    public void setEstimatedDelivery(LocalDateTime estimatedDelivery) {
        this.estimatedDelivery = estimatedDelivery;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Double getShippingLatitude() {
        return shippingLatitude;
    }

    public void setShippingLatitude(Double shippingLatitude) {
        this.shippingLatitude = shippingLatitude;
    }

    public Double getShippingLongitude() {
        return shippingLongitude;
    }

    public void setShippingLongitude(Double shippingLongitude) {
        this.shippingLongitude = shippingLongitude;
    }

    public Double getSellerLatitude() {
        return sellerLatitude;
    }

    public void setSellerLatitude(Double sellerLatitude) {
        this.sellerLatitude = sellerLatitude;
    }

    public Double getSellerLongitude() {
        return sellerLongitude;
    }

    public void setSellerLongitude(Double sellerLongitude) {
        this.sellerLongitude = sellerLongitude;
    }

    public String getBarcodeValue() {
        return barcodeValue;
    }

    public void setBarcodeValue(String barcodeValue) {
        this.barcodeValue = barcodeValue;
    }

    public boolean isBarcodeVerified() {
        return Boolean.TRUE.equals(barcodeVerified);
    }

    public void setBarcodeVerified(Boolean barcodeVerified) {
        this.barcodeVerified = barcodeVerified;
    }
}
