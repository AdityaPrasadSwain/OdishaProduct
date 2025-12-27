package com.odisha.handloom.security.services;

import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        System.out.println("DEBUG: loadUserByUsername called with raw: '" + identifier + "'");

        if (identifier == null || identifier.trim().isEmpty()) {
            throw new UsernameNotFoundException("Identifier cannot be empty");
        }

        String trimmedIdentifier = identifier.trim();
        User user = null;

        // 1. Try Phone Number first (Normalize: remove spaces, +91, dashes)
        // Keep only digits for checking
        String normalizedPhone = trimmedIdentifier.replaceAll("[^0-9]", "");

        // If it looks like a phone number (e.g., last 10 digits)
        if (normalizedPhone.length() >= 10) {
            String param = normalizedPhone;
            // If user entered +919861842856 -> 919861842856.
            // If DB stores 9861842856, we might need to be careful.
            // Assumption: DB stores 10 digit or full number.
            // Let's try exact match on trimmed first, then normalized if needed?
            // User prompt: "Strip country code if present"
            if (normalizedPhone.length() > 10) {
                param = normalizedPhone.substring(normalizedPhone.length() - 10);
            }
            System.out.println("DEBUG: Trying lookup by Phone: " + param);
            user = userRepository.findByPhoneNumber(param).orElse(null);
        }

        // 2. If not found, try as Email
        if (user == null) {
            System.out.println("DEBUG: Trying lookup by Email: " + trimmedIdentifier);
            user = userRepository.findByEmail(trimmedIdentifier).orElse(null);
        }

        if (user == null) {
            // Fallback: Try exact match on raw input just in case
            System.out.println("DEBUG: Trying exact match backup: " + trimmedIdentifier);
            user = userRepository.findByPhoneNumber(trimmedIdentifier).orElse(null);
        }

        if (user == null) {
            System.out.println("DEBUG: User NOT found for: " + trimmedIdentifier);
            throw new UsernameNotFoundException("User Not Found: " + trimmedIdentifier);
        }

        System.out.println("DEBUG: User found: " + user.getEmail() + " | Phone: " + user.getPhoneNumber());
        System.out.println("DEBUG: Stored Password Hash: " + user.getPassword());

        // Check if user is blocked
        if (user.isBlocked()) {
            throw new UsernameNotFoundException("User account is blocked: " + trimmedIdentifier);
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), // Use Email as priority username for Spring Security context? Or identifier?
                // Usually email is unique.
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    }
}
