package com.odisha.handloom.logistics.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "shiprocket")
@Data
public class ShiprocketConfig {
    private String email;
    private String password;
    private String baseUrl;
    private String webhookSecret;
}
