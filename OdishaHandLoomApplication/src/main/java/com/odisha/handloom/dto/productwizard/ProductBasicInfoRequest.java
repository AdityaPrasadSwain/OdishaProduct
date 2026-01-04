package com.odisha.handloom.dto.productwizard;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductBasicInfoRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotBlank(message = "Category is required")
    private String categoryId;

    private String material;
    private String color;
    private String size;
    private String origin;
    private String packOf;
}
