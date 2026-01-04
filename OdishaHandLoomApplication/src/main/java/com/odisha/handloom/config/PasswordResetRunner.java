package com.odisha.handloom.config;

import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordResetRunner implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String phone = "9861842856";
        String newPasswordRaw = "password123";

        System.out.println("=========================================");
        System.out.println("PASSWORD RESET RUNNER STARTED");
        System.out.println("Target Phone: " + phone);

        User user = userRepository.findByPhoneNumber(phone).orElse(null);
        if (user != null) {
            System.out.println("User found! ID: " + user.getId());
            // Log current hash (if any)
            try {
                System.out.println("Current DB Password Hash: " + user.getPassword());
            } catch (Exception e) {
            }

            String newHash = passwordEncoder.encode(newPasswordRaw);
            user.setPassword(newHash);
            userRepository.save(user);

            System.out.println("PASSWORD UPDATED SUCCESSFULLY.");
            System.out.println("New Hash: " + newHash);

            // Verification
            boolean matches = passwordEncoder.matches(newPasswordRaw, newHash);
            System.out.println("Verification (matches 'password123'?): " + matches);
        } else {
            System.out.println("User with phone " + phone + " NOT FOUND.");
        }
        System.out.println("=========================================");
    }
}
