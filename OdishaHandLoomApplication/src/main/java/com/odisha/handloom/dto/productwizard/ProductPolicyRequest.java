package com.odisha.handloom.dto.productwizard;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductPolicyRequest {
    private Integer dispatchDays;
    private Boolean returnAvailable;
    private Integer returnWindowDays;
    private String returnPolicyDescription;
    private Boolean cancellationAvailable;
}
