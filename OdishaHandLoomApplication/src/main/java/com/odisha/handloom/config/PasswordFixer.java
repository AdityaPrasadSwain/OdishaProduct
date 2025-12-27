package com.odisha.handloom.config;

import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class PasswordFixer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String targetPhone = "9861842856";
        String newPassword = "123456"; // Known password

        // Try to find the user
        // Note: We use the repository method we verified invokes the correct logic or
        // just standard findByPhoneNumber
        // Since we normalized lookup in Service, here we just do a direct DB lookup to
        // be sure.
        // Assuming the DB stores it as just digits based on our previous service logic
        // assumption.
        Optional<User> userOpt = userRepository.findByPhoneNumber(targetPhone);

        if (userOpt.isEmpty()) {
            // Try assuming it might have +91?
            // But let's stick to the 10 digit core.
            System.out.println("PASSWORD FIXER: User with phone " + targetPhone + " NOT found.");
        } else {
            User user = userOpt.get();
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
            userRepository.save(user);
            System.out.println("==================================================");
            System.out.println("PASSWORD FIXER: SUCCESS");
            System.out.println("User: " + user.getEmail() + " / " + user.getPhoneNumber());
            System.out.println("Password has been RESET to: " + newPassword);
            System.out.println("Please login with this password.");
            System.out.println("==================================================");
        }
    }
}
