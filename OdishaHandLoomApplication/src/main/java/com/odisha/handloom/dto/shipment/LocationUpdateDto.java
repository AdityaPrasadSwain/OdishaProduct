package com.odisha.handloom.dto.shipment;

public class LocationUpdateDto {
    private Double latitude;
    private Double longitude;
    private String status; // Optional status update with location

    public LocationUpdateDto() {
    }

    public LocationUpdateDto(Double latitude, Double longitude, String status) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
