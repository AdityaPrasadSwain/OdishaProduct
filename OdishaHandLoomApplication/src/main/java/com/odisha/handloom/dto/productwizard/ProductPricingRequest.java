package com.odisha.handloom.dto.productwizard;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductPricingRequest {
    @NotNull(message = "Price is required")
    private BigDecimal price;

    private BigDecimal discountPrice;

    @NotNull(message = "Stock quantity is required")
    private Integer stockQuantity;

    private Integer minOrderQuantity;
    private Integer maxOrderQuantity;

    private Boolean isCodAvailable;
}
