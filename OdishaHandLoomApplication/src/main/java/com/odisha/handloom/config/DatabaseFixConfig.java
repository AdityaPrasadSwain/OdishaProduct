package com.odisha.handloom.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DatabaseFixConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseFixConfig.class);

    @Bean
    public CommandLineRunner fixRegistrationStatusConstraint(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                logger.info("Keep-Alive: Attempting to update users_registration_status_check constraint...");

                // 0. Sanitize Data: Update old/invalid statuses to valid ones
                // e.g., PENDING_BASIC -> PENDING_DOCS
                // We use raw strings because PENDING_BASIC might not be in the Enum anymore
                String sanitizeSql = "UPDATE users SET registration_status = 'PENDING_DOCS' WHERE registration_status = 'PENDING_BASIC'";
                jdbcTemplate.execute(sanitizeSql);

                // Also handle NULLs if any
                String nullFixSql = "UPDATE users SET registration_status = 'PENDING_DOCS' WHERE registration_status IS NULL";
                jdbcTemplate.execute(nullFixSql);

                logger.info("Sanitized existing user registration statuses.");

                // 1. Drop existing constraint
                String dropSql = "ALTER TABLE users DROP CONSTRAINT IF EXISTS users_registration_status_check";
                jdbcTemplate.execute(dropSql);

                // 2. Add new constraint with ALL values from RegistrationStatus enum
                String addSql = "ALTER TABLE users ADD CONSTRAINT users_registration_status_check CHECK (registration_status IN ('PENDING_DOCS', 'PENDING_BANK', 'PENDING_VERIFICATION', 'COMPLETED', 'APPROVED', 'REJECTED', 'SUSPENDED', 'DOCUMENTS_REJECTED', 'BANK_REJECTED', 'BLOCKED'))";
                jdbcTemplate.execute(addSql);

                logger.info("Successfully updated users_registration_status_check constraint.");
            } catch (Exception e) {
                logger.warn("Failed to update constraint (might not be using Postgres or constraint name differs): "
                        + e.getMessage());
            }
        };
    }
}
