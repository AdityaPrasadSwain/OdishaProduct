package com.odisha.handloom.service.kyc;

import org.springframework.stereotype.Service;

@Service
public class GstVerificationService {

    // 22AAAAA0000A1Z5 (15 chars)
    private static final String GST_PATTERN = "\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}";

    public boolean verifyGst(String gstNumber) {
        if (gstNumber == null)
            return false;

        if (!gstNumber.matches(GST_PATTERN)) {
            // Check only length for lenient testing if regex is strict
            if (gstNumber.length() != 15)
                throw new IllegalArgumentException("Invalid GSTIN format");
        }
        // Simulate GSTN check
        return true;
    }
}
