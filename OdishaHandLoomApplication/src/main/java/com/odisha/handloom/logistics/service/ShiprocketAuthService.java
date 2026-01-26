package com.odisha.handloom.logistics.service;

import com.odisha.handloom.logistics.config.ShiprocketConfig;
import com.odisha.handloom.logistics.dto.ShiprocketAuthRequest;
import com.odisha.handloom.logistics.dto.ShiprocketAuthResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShiprocketAuthService {

    private final ShiprocketConfig shiprocketConfig;
    private RestClient restClient;

    private String authToken;
    private LocalDateTime tokenExpiry;

    @PostConstruct
    public void init() {
        this.restClient = RestClient.builder()
                .baseUrl(shiprocketConfig.getBaseUrl())
                .build();
    }

    public synchronized String getAuthToken() {
        if (authToken == null || isTokenExpired()) {
            log.info("Token expired or missing. Refreshing Shiprocket token...");
            login();
        }
        return authToken;
    }

    private boolean isTokenExpired() {
        // Shiprocket tokens last about 10 days, but we'll be conservative
        // If we don't have an expiry, assume we need a new one
        return tokenExpiry == null || LocalDateTime.now().isAfter(tokenExpiry);
    }

    private void login() {
        try {
            ShiprocketAuthRequest request = ShiprocketAuthRequest.builder()
                    .email(shiprocketConfig.getEmail())
                    .password(shiprocketConfig.getPassword())
                    .build();

            ShiprocketAuthResponse response = restClient.post()
                    .uri("/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(ShiprocketAuthResponse.class);

            if (response != null && response.getToken() != null) {
                this.authToken = response.getToken();
                // Token is valid for 10 days, setting expiry to 9 days to be safe
                this.tokenExpiry = LocalDateTime.now().plusDays(9);
                log.info("Shiprocket login successful. Token acquired.");
            } else {
                throw new RuntimeException("Failed to retrieve authentication token from Shiprocket.");
            }
        } catch (Exception e) {
            log.error("Error during Shiprocket login: {}", e.getMessage());
            throw new RuntimeException("Shiprocket authentication failed", e);
        }
    }
}
