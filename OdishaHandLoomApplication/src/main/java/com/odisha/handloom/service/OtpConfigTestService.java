package com.odisha.handloom.service;

import com.odisha.handloom.config.OtpProperties;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class OtpConfigTestService {

    private static final Logger logger = LoggerFactory.getLogger(OtpConfigTestService.class);
    private final OtpProperties otpProperties;

    public OtpConfigTestService(OtpProperties otpProperties) {
        this.otpProperties = otpProperties;
    }

    @PostConstruct
    public void printConfig() {
        logger.info("==========================================");
        logger.info(" OTP CONFIGURATION LOADED ");
        logger.info(" Enabled: {}", otpProperties.isEnabled());
        logger.info(" Expiry Minutes: {}", otpProperties.getExpiryMinutes());
        logger.info(" OTP Length: {}", otpProperties.getOtpLength());
        logger.info(" Sender ID: {}", otpProperties.getSenderId());
        logger.info("==========================================");
    }
}
