package com.odisha.handloom.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();
        if (!uploadPath.endsWith("/")) {
            uploadPath += "/";
        }

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }

    @Override
    public void addFormatters(org.springframework.format.FormatterRegistry registry) {
        registry.addConverter(String.class, com.odisha.handloom.entity.OrderStatus.class, source -> {
            try {
                return com.odisha.handloom.entity.OrderStatus.valueOf(source.toUpperCase());
            } catch (IllegalArgumentException e) {
                return null;
            }
        });
    }
}
