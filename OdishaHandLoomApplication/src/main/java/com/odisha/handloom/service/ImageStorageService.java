package com.odisha.handloom.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageStorageService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public String store(MultipartFile file, String subDir) throws IOException {
        // Validation
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.lastIndexOf(".") > 0) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        if (!isValidImage(extension)) {
            throw new IOException("Invalid image format. Only JPG, PNG, WEBP allowed.");
        }

        // Upload to Cloudinary
        // Convert MultipartFile to File (temp) because Cloudinary SDK prefers File or
        // bytes
        // Actually SDK supports bytes directly or File. Using bytes is cleaner.

        @SuppressWarnings("rawtypes")
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", "udrakala/" + subDir,
                "resource_type", "auto"));

        // Return the secure URL
        return (String) uploadResult.get("secure_url");
    }

    private boolean isValidImage(String extension) {
        String ext = extension.toLowerCase();
        return ext.equals(".jpg") || ext.equals(".jpeg") || ext.equals(".png") || ext.equals(".webp") ||
                ext.equals(".mp4") || ext.equals(".mov");
    }
}
