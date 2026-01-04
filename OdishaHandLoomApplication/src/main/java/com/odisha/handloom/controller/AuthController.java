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

import com.odisha.handloom.entity.Otp;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
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

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    com.odisha.handloom.service.OtpService otpService;

    @Autowired
    com.odisha.handloom.service.EmailService emailService;

    @Autowired
    com.odisha.handloom.service.AdminNotificationService adminNotificationService;

    @Autowired
    com.odisha.handloom.service.CloudinaryService cloudinaryService;

    @GetMapping("/login/otp-status")
    public ResponseEntity<?> getOtpStatus(@RequestParam String email) {
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Email required"));
        }
        return ResponseEntity.ok(otpService.getOtpStatus(email));
    }

    @PostMapping("/login/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody com.odisha.handloom.payload.request.OtpLoginRequest request) {
        String loginType = request.getLoginType() != null ? request.getLoginType().toUpperCase() : "EMAIL";
        String email = request.getEmail();
        String mobile = request.getMobile();

        String identifier = "MOBILE".equals(loginType) ? mobile : email;

        if (identifier == null || identifier.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("success", false, "message", "Identifier required"));
        }

        // 1. Check if user exists
        boolean userExists = "MOBILE".equals(loginType) ? userRepository.existsByPhoneNumber(identifier)
                : userRepository.existsByEmail(identifier);

        if (!userExists) {
            // Anti-enumeration: return success even if user not found, or explicit error?
            // Requirement said "OTP sent successfully" for success.
            // But existing code returned "If this account exists...".
            // User asked "Success: { success: true, message: 'OTP sent successfully' }"
            // To be secure, we should simulate delay or return success.
            // For now, mirroring "user not found" behavior might be safer to prevent
            // confusion in DEV.
            // But requirement "Make PROD strictly DLT-compliant" implies "Secure &
            // scalable".
            // I'll return the standard success message to mask existence.
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "OTP sent successfully"));
        }

        try {
            String msg = otpService.generateAndSendOtp(identifier, loginType);
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", msg));
        } catch (Exception e) {
            // "OTP service temporarily unavailable" for failure
            // Catching generic Exception to prevent any JVM crash from propagating
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("success", false, "message", "OTP service temporarily unavailable"));
        }
    }

    @PostMapping("/login/verify-otp")
    public ResponseEntity<?> loginWithOtp(@RequestBody com.odisha.handloom.payload.request.OtpLoginRequest request) {
        String loginType = request.getLoginType() != null ? request.getLoginType().toUpperCase() : "EMAIL";
        String identifier = "MOBILE".equals(loginType) ? request.getMobile() : request.getEmail();
        String otpCode = request.getOtp();

        if (identifier == null || otpCode == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("success", false, "message", "Missing fields"));
        }

        String validationResult = otpService.validateOtp(identifier, loginType, otpCode);

        if (!"Success".equals(validationResult)) {
            return ResponseEntity.badRequest()
                    .body(java.util.Map.of("success", false, "message", validationResult));
        }

        // Generate JWT
        User user = "MOBILE".equals(loginType)
                ? userRepository.findByPhoneNumber(identifier).orElseThrow()
                : userRepository.findByEmail(identifier).orElseThrow();

        if (user.isBlocked()) {
            return ResponseEntity.status(401).body(new MessageResponse("Account blocked"));
        }

        org.springframework.security.core.userdetails.UserDetails userDetails = org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getEmail())
                .password("")
                .authorities(user.getRole().name())
                .build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                userDetails.getAuthorities());
        String jwt = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getEmail(), List.of(user.getRole().name()),
                user.getFullName(), user.getShopName(), user.isApproved(), user.getProfilePictureUrl()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // Stateless logout: Client clears token. Server just clears context for this
        // request thread.
        SecurityContextHolder.clearContext();
        System.out.println("DEBUG: User logged out successfully.");
        return ResponseEntity.ok(new MessageResponse("Log out successful!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("DEBUG: Login attempt for: " + loginRequest.getIdentifier());
        System.out.println("DEBUG: Raw password provided: " + loginRequest.getPassword());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getIdentifier(), loginRequest.getPassword()));

            System.out.println("DEBUG: Authentication successful for: " + loginRequest.getIdentifier());

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
                    user.isApproved(),
                    user.getProfilePictureUrl()));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            System.out.println("DEBUG: BadCredentialsException occurred. Message: " + e.getMessage());

            throw e;
        }
    }

    @PostMapping(value = "/signup", consumes = { "multipart/form-data" })
    public ResponseEntity<?> registerUser(@Valid @ModelAttribute SignupRequest signUpRequest) {
        try {
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

            // Handle Profile Image Upload
            if (signUpRequest.getProfileImage() != null && !signUpRequest.getProfileImage().isEmpty()) {
                try {
                    String imageUrl = cloudinaryService.uploadImage(signUpRequest.getProfileImage(), "users/profiles");
                    user.setProfilePictureUrl(imageUrl);
                } catch (Exception e) {
                    System.err.println("Failed to upload profile image: " + e.getMessage());
                    // Proceed without image or return error? Proceeding is safer for UX, user can
                    // update later.
                }
            }

            if (role == Role.SELLER) {
                user.setShopName(signUpRequest.getShopName());
                user.setGstNumber(signUpRequest.getGstNumber());
                user.setApproved(false);

                userRepository.save(user);

                // Notify Admin
                adminNotificationService.notifySellerRegistration(user.getId(), user.getFullName());
            } else {
                user.setApproved(true);
                userRepository.save(user);
            }

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
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(java.util.Map.of(
                    "status", 500,
                    "message", "Registration failed: " + e.getMessage(),
                    "trace", e.toString()));
        }
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
                user.isApproved(),
                user.getProfilePictureUrl()));
    }

    @Transactional
    public void saveOtp(Otp otp) {
        if (otp.getId() == null) {
            entityManager.persist(otp);
        } else {
            entityManager.merge(otp);
        }
    }

    @Transactional
    public void deleteOldOtps(String email) {
        entityManager.createQuery("DELETE FROM Otp o WHERE o.email = :email")
                .setParameter("email", email)
                .executeUpdate();
    }
}
