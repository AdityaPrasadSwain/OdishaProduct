package com.odisha.handloom.service;

import com.odisha.handloom.config.OtpProperties;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

@Service
public class OtpBindingTestService {

    private final OtpProperties otpProperties;

    public OtpBindingTestService(OtpProperties otpProperties) {
        this.otpProperties = otpProperties;
    }

    @PostConstruct
    public void init() {
        System.out.println("------------------------------------------------");
        System.out.println("OTP CONFIG BINDING SUCCESSFUL");
        System.out.println("Expiry: " + otpProperties.getExpiryMinutes());
        System.out.println("Length: " + otpProperties.getOtpLength());
        System.out.println("Sender: " + otpProperties.getSenderId());
        System.out.println("Mode: " + otpProperties.getMode());
        System.out.println("------------------------------------------------");
    }
}
