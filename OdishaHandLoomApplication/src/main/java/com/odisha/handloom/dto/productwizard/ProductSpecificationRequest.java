package com.odisha.handloom.dto.productwizard;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSpecificationRequest {
    private List<ProductSpecEntry> specifications;
}
