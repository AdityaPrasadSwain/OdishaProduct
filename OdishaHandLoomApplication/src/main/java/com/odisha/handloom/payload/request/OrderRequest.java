package com.odisha.handloom.payload.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class OrderRequest {
    private List<OrderItemRequest> items;
    private String shippingAddress;
    private String paymentMethod;
    private String paymentId;
    private java.util.UUID addressId;

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    @JsonProperty("paymentId")
    public String getPaymentId() {
        return paymentId;
    }

    @JsonProperty("paymentId")
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public java.util.UUID getAddressId() {
        return addressId;
    }

    public void setAddressId(java.util.UUID addressId) {
        this.addressId = addressId;
    }

    @Override
    public String toString() {
        return "OrderRequest{" +
                "items=" + items +
                ", shippingAddress='" + shippingAddress + '\'' +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", paymentId='" + paymentId + '\'' +
                '}';
    }
}
