package com.odisha.handloom.logistics.service;

import com.odisha.handloom.logistics.config.ShiprocketConfig;
import com.odisha.handloom.logistics.dto.ShiprocketPickupRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShiprocketPickupService {

    private final ShiprocketAuthService authService;
    private final ShiprocketConfig shiprocketConfig;

    private RestClient getClient() {
        return RestClient.builder()
                .baseUrl(shiprocketConfig.getBaseUrl())
                .defaultHeader("Authorization", "Bearer " + authService.getAuthToken())
                .build();
    }

    public Map<String, Object> addPickupLocation(ShiprocketPickupRequest request) {
        try {
            return getClient().post()
                    .uri("/settings/pickup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            log.error("Error adding pickup location: {}", e.getMessage());
            throw new RuntimeException("Failed to add pickup location", e);
        }
    }

    public Map<String, Object> getPickupLocations() {
        try {
            return getClient().get()
                    .uri("/settings/pickup")
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            log.error("Error fetching pickup locations: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch pickup locations", e);
        }
    }
}
