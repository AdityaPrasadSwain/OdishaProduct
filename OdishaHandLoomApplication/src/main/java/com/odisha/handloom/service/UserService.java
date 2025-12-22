package com.odisha.handloom.service;

import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.dto.UserProfileUpdateDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public interface UserService {
    User updateUserProfile(UUID userId, UserProfileUpdateDto updateDto, MultipartFile profileImage) throws IOException;

    User getUserById(UUID userId);

    User getUserByEmail(String email);
}
