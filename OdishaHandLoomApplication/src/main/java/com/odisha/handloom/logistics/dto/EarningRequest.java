package com.odisha.handloom.logistics.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class EarningRequest {
    private double distanceKm;

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }
}
