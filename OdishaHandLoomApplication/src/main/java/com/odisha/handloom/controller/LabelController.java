package com.odisha.handloom.controller;

import com.odisha.handloom.service.LabelGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/label")
public class LabelController {

    @Autowired
    private LabelGenerationService labelService;

    @GetMapping("/qr/{orderId}")
    public ResponseEntity<byte[]> getOrderQrCode(@PathVariable UUID orderId) {
        try {
            if (orderId == null) {
                return ResponseEntity.badRequest().body(null);
            }
            // Payload Format: UDRAKA|ORDER|{orderId}
            String payload = "UDRAKA|ORDER|" + orderId.toString();

            byte[] image = labelService.generateQRCode(payload, 250, 250);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentLength(image.length);

            return new ResponseEntity<>(image, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/barcode/{trackingId}")
    public ResponseEntity<byte[]> getShippingBarcode(@PathVariable String trackingId) {
        try {
            if (trackingId == null || trackingId.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // Payload Format: trackingId only
            byte[] image = labelService.generateBarcode(trackingId, 300, 100);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentLength(image.length);

            return new ResponseEntity<>(image, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
