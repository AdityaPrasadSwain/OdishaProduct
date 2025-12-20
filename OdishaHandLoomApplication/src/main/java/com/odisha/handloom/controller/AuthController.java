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
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
    com.odisha.handloom.service.EmailService emailService;

    @Transactional
    @PostMapping("/login/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email is required"));
        }

        // 1. Check if user exists (Silent fail if not found for security, or explicit
        // generic message)
        if (!userRepository.existsByEmail(email)) {
            // Returning generic success to prevent email enumeration
            return ResponseEntity.ok(new MessageResponse("If this email is registered, an OTP has been sent."));
        }

        // 2. Cooldown Check (60 seconds)
        // Manual JPQL query
        List<Otp> allOtps = entityManager.createQuery("SELECT o FROM Otp o WHERE o.email = :email", Otp.class)
                .setParameter("email", email)
                .getResultList();

        Optional<Otp> existingOtp = allOtps.stream()
                .filter(o -> !o.isUsed())
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .findFirst();

        if (existingOtp.isPresent()) {
            Otp otp = existingOtp.get();
            if (otp.getLastSentAt().plusSeconds(60).isAfter(LocalDateTime.now())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Please wait before requesting a new OTP"));
            }
        }

        // 3. Generate New OTP
        String otpCode = String.format("%06d", new SecureRandom().nextInt(999999));

        // 4. Clean old OTPs (Strict Requirement)
        deleteOldOtps(email);

        Otp newOtp = Otp.builder()
                .email(email)
                .otp(otpCode)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .used(false)
                .attemptCount(0)
                .lastSentAt(LocalDateTime.now())
                .build();

        saveOtp(newOtp);

        System.out.println("=================================================");
        System.out.println(" DEBUG OTP: " + otpCode);
        System.out.println("=================================================");

        // 5. Send Email
        try {
            emailService.sendOtpEmail(email, otpCode);
        } catch (Exception e) {
            System.err.println("EMAIL FAILED: " + e.getMessage());
            // FALLBACK FOR DEBUGGING: Return success so user can use Console OTP
            return ResponseEntity.ok(
                    new MessageResponse("Email failed (" + e.getMessage() + ") BUT OTP generated. Check Server Logs."));
        }

        return ResponseEntity.ok(new MessageResponse("OTP sent successfully to your email."));
    }

    @Transactional
    @PostMapping("/login/otp")
    public ResponseEntity<?> loginWithOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otpCode = request.get("otp");

        if (email == null || otpCode == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email and OTP are required"));
        }

        // 1. Fetch latest unused OTP
        List<Otp> allOtps = entityManager.createQuery("SELECT o FROM Otp o WHERE o.email = :email", Otp.class)
                .setParameter("email", email)
                .getResultList();

        Optional<Otp> otpOptional = allOtps.stream()
                .filter(o -> !o.isUsed())
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .findFirst();

        if (otpOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired OTP"));
        }

        Otp otp = otpOptional.get();

        if (otp.isUsed()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired OTP"));
        }

        // 2. Check Expiry
        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(new MessageResponse("OTP expired"));
        }

        // 3. Check Attempt Limit
        if (otp.getAttemptCount() >= 5) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("OTP attempts exceeded. Please request a new OTP"));
        }

        // 4. Validate Code
        if (!otp.getOtp().equals(otpCode)) {
            otp.setAttemptCount(otp.getAttemptCount() + 1);
            saveOtp(otp);
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid OTP"));
        }

        // 5. Success - Mark Used
        otp.setUsed(true);
        saveOtp(otp);

        // 6. Generate JWT & Login
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isBlocked()) {
            return ResponseEntity.status(401).body(new MessageResponse("Your account has been blocked."));
        }

        // Manually create authentication token without password check
        // We need a way to authenticate "without password".
        // Usually, we load UserDetails and create UsernamePasswordAuthenticationToken
        // with authorities.
        // Or we use a custom AuthenticationProvider.
        // For simplicity reusing jwtUtils.generateJwtToken(authentication) requires an
        // Authentication object.

        // Let's create a dummy Auth object since we verified identity via OTP
        org.springframework.security.core.userdetails.UserDetails userDetails = org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getEmail())
                .password("") // data not used
                .authorities(user.getRole().name())
                .build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                userDetails.getAuthorities());
        // No need to set Context if stateless, but good practice

        String jwt = jwtUtils.generateJwtToken(authentication);
        List<String> roles = List.of(user.getRole().name());

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getEmail(),
                roles,
                user.getFullName(),
                user.getShopName(),
                user.isApproved()));
    }

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
