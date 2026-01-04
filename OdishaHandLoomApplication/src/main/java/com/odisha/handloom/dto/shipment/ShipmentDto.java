package com.odisha.handloom.dto.shipment;

import java.time.LocalDateTime;
import java.util.UUID;

public class ShipmentDto {
    private UUID id;
    private UUID orderId;
    private UUID agentId;
    private String agentName;
    private String agentPhone;
    private String status;
    private Double currentLatitude;
    private Double currentLongitude;
    private LocalDateTime estimatedDelivery;
    private LocalDateTime updatedAt;

    // customer/shipping details from order
    private String shippingAddress;
    private String customerName;
    private String customerPhone;

    public ShipmentDto() {
    }

    // Builder, Getters, Setters
    public static ShipmentDtoBuilder builder() {
        return new ShipmentDtoBuilder();
    }

    public static class ShipmentDtoBuilder {
        private ShipmentDto dto = new ShipmentDto();

        public ShipmentDtoBuilder id(UUID id) {
            dto.id = id;
            return this;
        }

        public ShipmentDtoBuilder orderId(UUID orderId) {
            dto.orderId = orderId;
            return this;
        }

        public ShipmentDtoBuilder agentId(UUID agentId) {
            dto.agentId = agentId;
            return this;
        }

        public ShipmentDtoBuilder agentName(String agentName) {
            dto.agentName = agentName;
            return this;
        }

        public ShipmentDtoBuilder agentPhone(String agentPhone) {
            dto.agentPhone = agentPhone;
            return this;
        }

        public ShipmentDtoBuilder status(String status) {
            dto.status = status;
            return this;
        }

        public ShipmentDtoBuilder currentLatitude(Double lat) {
            dto.currentLatitude = lat;
            return this;
        }

        public ShipmentDtoBuilder currentLongitude(Double lng) {
            dto.currentLongitude = lng;
            return this;
        }

        public ShipmentDtoBuilder estimatedDelivery(LocalDateTime date) {
            dto.estimatedDelivery = date;
            return this;
        }

        public ShipmentDtoBuilder updatedAt(LocalDateTime date) {
            dto.updatedAt = date;
            return this;
        }

        public ShipmentDtoBuilder shippingAddress(String addr) {
            dto.shippingAddress = addr;
            return this;
        }

        public ShipmentDtoBuilder customerName(String name) {
            dto.customerName = name;
            return this;
        }

        public ShipmentDtoBuilder customerPhone(String phone) {
            dto.customerPhone = phone;
            return this;
        }

        public ShipmentDto build() {
            return dto;
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getOrderId() {
        return orderId;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }

    public UUID getAgentId() {
        return agentId;
    }

    public void setAgentId(UUID agentId) {
        this.agentId = agentId;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public String getAgentPhone() {
        return agentPhone;
    }

    public void setAgentPhone(String agentPhone) {
        this.agentPhone = agentPhone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
}
