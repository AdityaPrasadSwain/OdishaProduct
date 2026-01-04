package com.odisha.handloom.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class LabelGenerationService {

    public byte[] generateQRCode(String text, int width, int height) throws Exception {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("QR Code text cannot be empty");
        }

        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
        hints.put(EncodeHintType.MARGIN, 1);

        BitMatrix bitMatrix = new MultiFormatWriter().encode(
                text,
                BarcodeFormat.QR_CODE,
                width,
                height,
                hints);

        return toPngBytes(bitMatrix);
    }

    public byte[] generateBarcode(String text, int width, int height) throws Exception {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Barcode text cannot be empty");
        }

        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.MARGIN, 1); // Small margin for barcode

        BitMatrix bitMatrix = new MultiFormatWriter().encode(
                text,
                BarcodeFormat.CODE_128,
                width,
                height,
                hints);

        return toPngBytes(bitMatrix);
    }

    private byte[] toPngBytes(BitMatrix bitMatrix) throws Exception {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        return outputStream.toByteArray();
    }
}
