package com.odisha.handloom.controller;

import com.odisha.handloom.dto.PincodeResponse;
import com.odisha.handloom.service.PincodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pincode")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Adjust for production security
public class PincodeController {

    private final PincodeService pincodeService;

    /**
     * GET /api/pincode/{pin}
     * Lookup address details by PIN code.
     */
    @GetMapping("/{pin}")
    public ResponseEntity<PincodeResponse> lookupPincode(@PathVariable String pin) {
        // Input sanitization
        String cleanPin = pin.trim();

        if (cleanPin.length() != 6 || !cleanPin.matches("\\d+")) {
            return ResponseEntity.badRequest()
                    .body(PincodeResponse.builder()
                            .valid(false)
                            .pincode(cleanPin)
                            .message("PIN Code must be exactly 6 digits")
                            .build());
        }

        PincodeResponse response = pincodeService.fetchPincodeDetails(cleanPin);
        return ResponseEntity.ok(response);
    }
}
