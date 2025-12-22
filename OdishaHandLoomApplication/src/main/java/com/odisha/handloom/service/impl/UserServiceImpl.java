package com.odisha.handloom.service.impl;

import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.dto.UserProfileUpdateDto;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.CloudinaryService;
import com.odisha.handloom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public User updateUserProfile(UUID userId, UserProfileUpdateDto updateDto, MultipartFile profileImage)
            throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateDto.getFullName() != null)
            user.setFullName(updateDto.getFullName());
        if (updateDto.getPhoneNumber() != null)
            user.setPhoneNumber(updateDto.getPhoneNumber());
        if (updateDto.getAddress() != null)
            user.setAddress(updateDto.getAddress());
        if (updateDto.getBio() != null)
            user.setBio(updateDto.getBio());
        if (updateDto.getGender() != null)
            user.setGender(updateDto.getGender());

        if (profileImage != null && !profileImage.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(profileImage);
            user.setProfilePictureUrl(imageUrl);
        }

        return userRepository.save(user);
    }

    @Override
    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
