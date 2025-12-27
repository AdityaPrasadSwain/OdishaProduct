package com.odisha.handloom.security.jwt;

import com.odisha.handloom.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String headerAuth = request.getHeader("Authorization");

            // 1. Early Exit if no token
            if (!StringUtils.hasText(headerAuth) || !headerAuth.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            // 2. Process Token
            String jwt = headerAuth.substring(7);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            // Guarantee: This filter never crashes the request.
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        // Continue chain if not returned earlier (though Early Exit handles the empty
        // case)
        // Note: The Early Exit above calls doFilter and returns.
        // If we passed that check, we processed the token. Now we must continue the
        // chain.
        // Wait, if we processed the token, we still need to call doFilter.
        // So we can't 'return' in the Early Exit AND have a 'doFilter' at the end
        // unless we structure carefully.
        // User's snippet:
        // if (invalid) { filterChain.doFilter; return; }
        // ... process ...
        // filterChain.doFilter;

        // My previous code:
        // try { process } catch {}
        // filterChain.doFilter

        // This is safe. The user's snippet calls doFilter twice (once in if, once at
        // end).
        // I will adapt to that structure to be 100% compliant.

        filterChain.doFilter(request, response);
    }

}
