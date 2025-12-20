package com.odisha.handloom.configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @org.springframework.beans.factory.annotation.Value("${cloudinary.cloud-name}")
    private String cloudName;

    @org.springframework.beans.factory.annotation.Value("${cloudinary.api-key}")
    private String apiKey;

    @org.springframework.beans.factory.annotation.Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }
}
