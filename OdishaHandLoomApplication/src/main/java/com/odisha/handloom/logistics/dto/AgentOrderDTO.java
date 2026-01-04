package com.odisha.handloom.logistics.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class AgentOrderDTO {
    private UUID shipmentId;
    private UUID orderId;
    private String customerName;
    private String customerPhone;
    private Double customerLat;
    private Double customerLng;
    private String shippingAddress;
    private String status;
    private Double distanceKm;
    private BigDecimal earningAmount;
    private String paymentMode;
    private LocalDateTime createdDate;
    private boolean isCod;
    private BigDecimal totalAmount;

    public UUID getShipmentId() {
        return shipmentId;
    }

    public UUID getOrderId() {
        return orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public Double getCustomerLat() {
        return customerLat;
    }

    public Double getCustomerLng() {
        return customerLng;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public String getStatus() {
        return status;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public BigDecimal getEarningAmount() {
        return earningAmount;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public boolean isCod() {
        return isCod;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setShipmentId(UUID shipmentId) {
        this.shipmentId = shipmentId;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public void setCustomerLat(Double customerLat) {
        this.customerLat = customerLat;
    }

    public void setCustomerLng(Double customerLng) {
        this.customerLng = customerLng;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public void setEarningAmount(BigDecimal earningAmount) {
        this.earningAmount = earningAmount;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public void setCod(boolean isCod) {
        this.isCod = isCod;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
