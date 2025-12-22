package com.odisha.handloom.service.impl;

import com.odisha.handloom.service.SmsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class Fast2SmsService implements SmsService {

    @Value("${fast2sms.api.key}")
    private String apiKey;

    @Async
    @Override
    public void sendOtp(String mobile, String otp) {
        System.out.println("Sending OTP to mobile: " + mobile + " (Service Method Invoked)");
        try {
            // 1. Sanitize and Validate Mobile Number
            if (mobile == null) {
                System.err.println("Mobile number is null, cannot send OTP.");
                return;
            }

            // Remove spaces, dashes, +91, etc.
            String cleanMobile = mobile.replaceAll("[^0-9]", "");

            // If it starts with 91 and is 12 digits, strip 91.
            if (cleanMobile.length() == 12 && cleanMobile.startsWith("91")) {
                cleanMobile = cleanMobile.substring(2);
            }

            // Fast2SMS requires 10 digit number
            if (cleanMobile.length() != 10) {
                System.err.println("Invalid mobile number format: " + mobile + ". Expected 10 digits.");
                return;
            }

            // 2. Prepare Request
            String url = "https://www.fast2sms.com/dev/bulkV2";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            // JSON Body
            Map<String, String> body = new HashMap<>();
            body.put("route", "otp");
            body.put("variables_values", otp);
            body.put("numbers", cleanMobile);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            RestTemplate restTemplate = new RestTemplate();

            // 3. Send POST Request
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            // 4. Log Response
            System.out.println("Fast2SMS OTP Sent to " + cleanMobile + ". Status: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());

        } catch (Exception e) {
            System.err.println("Failed to send SMS via Fast2SMS: " + e.getMessage());
            e.printStackTrace();
            System.out.println("DEV FALLBACK OTP (SMS FAILED): " + otp);
        }
    }
}
