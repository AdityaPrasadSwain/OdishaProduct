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
public class ProductSpecEntry {
    @NotBlank(message = "Key is required")
    private String key;

    @NotBlank(message = "Value is required")
    private String value;
}
