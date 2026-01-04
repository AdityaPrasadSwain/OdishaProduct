package com.odisha.handloom.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
@EnableCaching
public class PincodeConfig {

    @Bean
    public org.springframework.web.client.RestClient restClient() {
        return org.springframework.web.client.RestClient.builder()
                .baseUrl("https://api.postalpincode.in")
                .build();
    }

    @Bean
    public CacheManager cacheManager() {
        // Simple in-memory cache for demonstration.
        // In production, use Redis or Caffeine for better eviction policies.
        return new ConcurrentMapCacheManager("pincode_cache");
    }
}
