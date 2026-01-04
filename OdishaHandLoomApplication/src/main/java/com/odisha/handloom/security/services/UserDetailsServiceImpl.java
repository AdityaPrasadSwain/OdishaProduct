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
        String normalizedPhone = trimmedIdentifier.replaceAll("[^0-9]", "");

        // Strategy 1: Last 10 digits (Standard Indian format)
        if (normalizedPhone.length() >= 10) {
            String last10 = normalizedPhone.substring(normalizedPhone.length() - 10);
            System.out.println("DEBUG: Trying lookup by Phone (Last 10): " + last10);
            user = userRepository.findByPhoneNumber(last10).orElse(null);
        }

        // Strategy 2: Full Normalized Digits (e.g. 919861842856)
        if (user == null && !normalizedPhone.isEmpty()) {
            System.out.println("DEBUG: Trying lookup by Phone (Full Normalized): " + normalizedPhone);
            user = userRepository.findByPhoneNumber(normalizedPhone).orElse(null);
        }

        // 2. If not found, try as Email
        if (user == null) {
            System.out.println("DEBUG: Trying lookup by Email: " + trimmedIdentifier);
            user = userRepository.findByEmail(trimmedIdentifier).orElse(null);
        }

        if (user == null) {
            // Fallback: Try exact match on raw input just in case
            System.out.println("DEBUG: Trying exact match backup for phone: " + trimmedIdentifier);
            user = userRepository.findByPhoneNumber(trimmedIdentifier).orElse(null);
        }

        if (user == null) {
            System.out.println("DEBUG: User NOT found for input: " + trimmedIdentifier);
            // Hint for developers: Check if 91 prefix is an issue
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
