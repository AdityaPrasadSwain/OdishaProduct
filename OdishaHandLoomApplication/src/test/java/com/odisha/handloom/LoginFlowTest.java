package com.odisha.handloom;

import com.odisha.handloom.entity.Role;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.security.jwt.JwtUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class LoginFlowTest {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    public void testLoginWithPhoneNumber() {
        // 1. Setup Data
        String phoneNumber = "7815013235";
        String password = "password123";
        String email = "test@example.com";

        // Ensure user doesn't exist
        if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
            userRepository.delete(userRepository.findByPhoneNumber(phoneNumber).get());
        }

        User user = new User();
        user.setPhoneNumber(phoneNumber);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName("Test User");
        user.setRole(Role.CUSTOMER);
        userRepository.save(user);

        // 2. Attempt Login (Simulate AuthController logic)
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(phoneNumber, password));

            // 3. Verify
            assertNotNull(authentication);
            assertTrue(authentication.isAuthenticated());

            String jwt = jwtUtils.generateJwtToken(authentication);
            assertNotNull(jwt);
            System.out.println("LOGIN SUCCESS: Token generated for " + phoneNumber);

        } catch (Exception e) {
            fail("Login failed for phone number " + phoneNumber + ": " + e.getMessage());
        }
    }

    @Test
    public void testLoginWithEmail() {
        // 1. Setup Data
        String phoneNumber = "9876543210";
        String password = "password123";
        String email = "email_login_test@example.com";

        // Ensure user doesn't exist
        if (userRepository.findByEmail(email).isPresent()) {
            userRepository.delete(userRepository.findByEmail(email).get());
        }

        User user = new User();
        user.setPhoneNumber(phoneNumber);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName("Email Test User");
        user.setRole(Role.CUSTOMER);
        userRepository.save(user);

        // 2. Attempt Login (Simulate AuthController logic)
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            // 3. Verify
            assertNotNull(authentication);
            assertTrue(authentication.isAuthenticated());

            String jwt = jwtUtils.generateJwtToken(authentication);
            assertNotNull(jwt);
            System.out.println("LOGIN SUCCESS: Token generated for " + email);

        } catch (Exception e) {
            fail("Login failed for email " + email + ": " + e.getMessage());
        }
    }
}