package com.odisha.handloom.service;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        return uploadImage(file, null);
    }

    public String uploadImage(MultipartFile file, String folderName) throws IOException {
        Map<String, Object> options = new java.util.HashMap<>();
        if (folderName != null && !folderName.isEmpty()) {
            options.put("folder", folderName);
        }
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        return uploadResult.get("secure_url").toString();
    }

    public String uploadVideo(MultipartFile file) throws IOException {
        java.util.Map<String, Object> params = new java.util.HashMap<>();
        params.put("resource_type", "video");
        params.put("format", "mp4");
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
        return uploadResult.get("secure_url").toString();
    }
}
