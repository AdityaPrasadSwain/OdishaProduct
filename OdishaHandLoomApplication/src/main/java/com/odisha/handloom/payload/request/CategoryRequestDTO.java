package com.odisha.handloom.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class CategoryRequestDTO {

    @NotBlank(message = "Category name is required")
    @Size(max = 50, message = "Category name must be less than 50 characters")
    private String name;

    @NotBlank(message = "Icon name is required")
    private String iconName;

    @Size(max = 255, message = "Description must be less than 255 characters")
    private String description;

    private Integer displayOrder = 0;

    private Boolean active = true;

    private UUID parentCategoryId;
}
