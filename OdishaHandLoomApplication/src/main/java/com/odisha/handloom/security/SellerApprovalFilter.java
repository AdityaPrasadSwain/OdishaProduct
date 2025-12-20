package com.odisha.handloom.security;

import com.odisha.handloom.entity.Role;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SellerApprovalFilter extends OncePerRequestFilter {

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Only check seller paths
        if (path.startsWith("/api/seller")) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                String email = null;
                Object principal = auth.getPrincipal();

                if (principal instanceof UserDetails) {
                    email = ((UserDetails) principal).getUsername();
                }

                if (email != null) {
                    User user = userRepository.findByEmail(email).orElse(null);
                    if (user != null && user.getRole() == Role.SELLER && !user.isApproved()) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.getWriter().write(
                                "{\"message\": \"Not approved by admin. Your account will be approved within 24–48 hours.\"}");
                        return;
                    }
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
