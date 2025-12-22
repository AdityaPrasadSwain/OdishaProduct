package com.odisha.handloom.controller;

import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.dto.UserProfileUpdateDto;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(new MessageResponse("Unauthorized"));
        }

        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error fetching profile: " + e.getMessage()));
        }
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUserProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @ModelAttribute UserProfileUpdateDto updateDto,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body(new MessageResponse("Unauthorized"));
        }

        try {
            User currentUser = userService.getUserByEmail(userDetails.getUsername());
            User updatedUser = userService.updateUserProfile(currentUser.getId(), updateDto, profileImage);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Error uploading image: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating profile: " + e.getMessage()));
        }
    }
}
