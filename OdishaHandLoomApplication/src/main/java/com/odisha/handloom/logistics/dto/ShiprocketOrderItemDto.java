package com.odisha.handloom.logistics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShiprocketOrderItemDto {
    private String name;
    private String sku;
    private int units;
    private double selling_price;
    private double discount;
    private double tax;
    private int hsn;
}
