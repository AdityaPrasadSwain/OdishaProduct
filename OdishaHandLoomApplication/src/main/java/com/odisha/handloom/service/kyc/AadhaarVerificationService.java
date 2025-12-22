package com.odisha.handloom.service.kyc;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AadhaarVerificationService {

    // Simple in-memory OTP store for simulation
    // In production, use Redis with TTL
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public String sendOtp(String aadhaarNumber) {
        if (aadhaarNumber == null || !aadhaarNumber.matches("\\d{12}")) {
            throw new IllegalArgumentException("Invalid Aadhaar format");
        }

        // Simulate sending OTP via UIDAI SMS
        String mockOtp = "123456";
        otpStore.put(aadhaarNumber, mockOtp);

        System.out.println("SIMULATION: Sent Aadhaar OTP " + mockOtp + " to " + aadhaarNumber);
        return "REQ-" + System.currentTimeMillis(); // Mock Request ID
    }

    public boolean verifyOtp(String aadhaarNumber, String otp) {
        String storedOtp = otpStore.get(aadhaarNumber);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStore.remove(aadhaarNumber);
            return true;
        }
        return false;
    }
}
