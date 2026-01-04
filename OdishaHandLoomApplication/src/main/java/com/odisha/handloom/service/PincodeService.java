package com.odisha.handloom.service;

import com.odisha.handloom.dto.IndiaPostResponse;
import com.odisha.handloom.dto.PincodeResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PincodeService {

    private final RestClient restClient;

    /**
     * Fetches address details for a given PIN Code.
     * Uses Spring Cache to store results for 24 hours (simulated by cache manager
     * policy).
     *
     * @param pincode 6-digit PIN Code
     * @return PincodeResponse with details or valid=false
     */
    @Cacheable(value = "pincode_cache", unless = "#result.valid == false")
    public PincodeResponse fetchPincodeDetails(String pincode) {
        log.info("Fetching details for PIN Code: {}", pincode);

        // 1. Basic Validation
        if (!isValidPincodeFormat(pincode)) {
            log.warn("Invalid format provided: {}", pincode);
            return PincodeResponse.invalid(pincode);
        }

        try {
            // 2. Call India Post API
            // Returns a List because the API wraps the single object in an array
            List<IndiaPostResponse> apiResponses = restClient.get()
                    .uri("/pincode/" + pincode)
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<IndiaPostResponse>>() {
                    });

            if (apiResponses == null || apiResponses.isEmpty()) {
                return PincodeResponse.invalid(pincode);
            }

            IndiaPostResponse response = apiResponses.get(0);

            // 3. Process Response
            if ("Success".equalsIgnoreCase(response.getStatus()) && response.getPostOffice() != null
                    && !response.getPostOffice().isEmpty()) {
                IndiaPostResponse.PostOffice firstOffice = response.getPostOffice().get(0);

                return PincodeResponse.builder()
                        .valid(true)
                        .pincode(pincode)
                        .state(firstOffice.getState())
                        .district(firstOffice.getDistrict())
                        .city(firstOffice.getName()) // Using Name as City/PO equivalent
                        .country(firstOffice.getCountry())
                        .build();
            } else {
                return PincodeResponse.invalid(pincode);
            }

        } catch (Exception e) {
            log.error("Failed to fetch PIN Code details for {}: {}", pincode, e.getMessage());
            // In case of API failure, return invalid but valid=false helps frontend handle
            // it gracefully
            return PincodeResponse.builder()
                    .valid(false)
                    .pincode(pincode)
                    .message("Service Unavailable or Invalid PIN")
                    .build();
        }
    }

    private boolean isValidPincodeFormat(String pincode) {
        return pincode != null && pincode.matches("\\d{6}");
    }
}
