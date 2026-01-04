package com.odisha.handloom.dto.productwizard;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryDto {
    private UUID id;

    // Step 1: Basic Info
    private String name;
    private String description;
    private String categoryName;
    private String material;
    private String color;
    private String size;
    private String origin;
    private String packOf;

    // Step 2: Pricing
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private Integer minOrderQuantity;
    private Integer maxOrderQuantity;
    private Boolean isCodAvailable;

    // Step 3: Images
    private List<String> imageUrls;

    // Step 4: Specs
    private List<ProductSpecEntry> specifications;

    // Step 5: Policy
    private Integer dispatchDays;
    private Boolean returnAvailable;
    private Integer returnWindowDays;
    private String returnPolicyDescription;
    private Boolean cancellationAvailable;
}
