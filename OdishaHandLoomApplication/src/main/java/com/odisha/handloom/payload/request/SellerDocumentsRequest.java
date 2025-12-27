package com.odisha.handloom.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SellerDocumentsRequest {
    @NotBlank
    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}")
    private String panNumber;

    @NotBlank
    @Pattern(regexp = "\\d{12}")
    private String aadhaarNumber;

    @NotBlank
    @Pattern(regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")
    private String gstNumber;

    // Files will be handled as RequestParams ideally, but keeping fields for DTO
    // structure
    // MultipartFile fields usually don't map directly in @RequestBody JSON, so
    // controller will use @ModelAttribute or @RequestPart
}
