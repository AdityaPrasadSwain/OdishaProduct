package com.odisha.handloom.logistics.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShiprocketPickupRequest {
    @JsonProperty("pickup_location")
    private String pickupLocation;

    private String name;
    private String email;
    private String phone;
    private String address;

    @JsonProperty("address_2")
    private String address2;

    private String city;
    private String state;
    private String country;

    @JsonProperty("pin_code")
    private String pinCode;
}
