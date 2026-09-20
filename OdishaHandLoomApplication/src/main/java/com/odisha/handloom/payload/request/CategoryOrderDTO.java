package com.odisha.handloom.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CategoryOrderDTO {

    @NotNull(message = "Category ID is required")
    private UUID id;

    @NotNull(message = "Display order is required")
    private Integer displayOrder;
}
