package com.odisha.handloom.service.kyc;

import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class PanVerificationService {

    private static final String PAN_PATTERN = "[A-Z]{5}[0-9]{4}[A-Z]{1}";

    public boolean verifyPan(String pan, String fullName, String dob) {
        // 1. Validation
        if (pan == null || !Pattern.matches(PAN_PATTERN, pan)) {
            throw new IllegalArgumentException("Invalid PAN format");
        }

        // 2. Simulation (In real world, call Protean API)
        // Simulate failure for specific mock valid PANs if needed, else success
        return true;
    }
}
