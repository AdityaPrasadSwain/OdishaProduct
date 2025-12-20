package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Role;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.request.LoginRequest;
import com.odisha.handloom.payload.request.SignupRequest;
import com.odisha.handloom.payload.response.JwtResponse;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.security.jwt.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    com.odisha.handloom.service.EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getIdentifier(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        org.springframework.security.core.userdetails.User userDetails = (org.springframework.security.core.userdetails.User) authentication
                .getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        // Check if user is blocked
        if (user.isBlocked()) {
            return ResponseEntity.status(401)
                    .body(new MessageResponse("Your account has been blocked. Please contact support."));
        }

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getEmail(),
                roles,
                user.getFullName(),
                user.getShopName(),
                user.isApproved()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // 1. Check Uniqueness
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "status", 400,
                    "field", "email",
                    "message", "This email is already registered."));
        }

        if (userRepository.existsByPhoneNumber(signUpRequest.getPhoneNumber())) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "status", 400,
                    "field", "phoneNumber",
                    "message", "This phone number is already registered."));
        }

        // 2. Validate Account Type
        String strRole = signUpRequest.getRole();
        Role role;

        if (strRole == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "status", 400,
                    "field", "role",
                    "message", "Please select an account type."));
        }

        try {
            // Basic role parsing logic already in annotations, but logical check:
            String roleLower = strRole.toLowerCase();
            if ("admin".equals(roleLower))
                role = Role.ADMIN;
            else if ("seller".equals(roleLower))
                role = Role.SELLER;
            else if ("customer".equals(roleLower))
                role = Role.CUSTOMER;
            else
                throw new IllegalArgumentException();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                    "status", 400,
                    "field", "role",
                    "message", "Invalid account type selected."));
        }

        // 3. Conditional Seller Validation
        if (role == Role.SELLER) {
            if (signUpRequest.getShopName() == null || signUpRequest.getShopName().isBlank()) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                        "status", 400,
                        "field", "shopName",
                        "message", "Shop Name is required for seller accounts."));
            }
            if (signUpRequest.getGstNumber() == null || signUpRequest.getGstNumber().isBlank()) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                        "status", 400,
                        "field", "gstNumber",
                        "message", "GST Number is required for seller accounts."));
            }
            if (signUpRequest.getShopName().length() < 3) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                        "status", 400,
                        "field", "shopName",
                        "message", "Shop Name must be at least 3 characters long."));
            }
            if (signUpRequest.getGstNumber().length() != 15) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                        "status", 400,
                        "field", "gstNumber",
                        "message", "Please enter a valid GST Number."));
            }
            if (userRepository.existsByGstNumber(signUpRequest.getGstNumber())) {
                return ResponseEntity.badRequest().body(java.util.Map.of(
                        "status", 400,
                        "field", "gstNumber",
                        "message", "This GST Number is already registered."));
            }
        }

        // Create new user's account
        User user = User.builder()
                .fullName(signUpRequest.getFullName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .phoneNumber(signUpRequest.getPhoneNumber())
                .role(role)
                .build();

        if (role == Role.SELLER) {
            user.setShopName(signUpRequest.getShopName());
            user.setGstNumber(signUpRequest.getGstNumber());
            user.setApproved(false);
        } else {
            user.setApproved(true);
        }

        userRepository.save(user);

        // Send Welcome Email
        try {
            if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());
            }
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        return ResponseEntity.ok(new MessageResponse(role == Role.SELLER ? "Seller account created successfully."
                : "Account created successfully. Please login."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("User not authenticated"));
        }

        org.springframework.security.core.userdetails.User userDetails = (org.springframework.security.core.userdetails.User) authentication
                .getPrincipal();

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(null,
                user.getId(),
                user.getEmail(),
                roles,
                user.getFullName(),
                user.getShopName(),
                user.isApproved()));
    }
}
