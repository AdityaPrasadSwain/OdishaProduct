package com.odisha.handloom.logistics.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ShiprocketAuthResponse {
    private int id;

    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("last_name")
    private String lastName;

    private String email;

    @JsonProperty("company_id")
    private int companyId;

    @JsonProperty("created_at")
    private String createdAt;

    private String token;
}
