package com.odisha.handloom.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class OptimisticLockingFixRunner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("=========================================");
        System.out.println("OPTIMISTIC LOCKING FIX RUNNER STARTED");

        try {
            // 1. Update existing nulls
            int updated = jdbcTemplate.update("UPDATE products SET version = 0 WHERE version IS NULL");
            System.out.println("Updated " + updated + " rows with NULL version.");

            // 2. Set Default - catching errors if already set
            try {
                jdbcTemplate.execute("ALTER TABLE products ALTER COLUMN version SET DEFAULT 0");
                System.out.println("Set DEFAULT 0 for version column.");
            } catch (Exception e) {
                // Ignore if default already set
            }

            // 3. Set NOT NULL
            try {
                jdbcTemplate.execute("ALTER TABLE products ALTER COLUMN version SET NOT NULL");
                System.out.println("Set NOT NULL for version column.");
            } catch (Exception e) {
                // Ignore if already not null
            }

            System.out.println("OPTIMISTIC LOCKING FIX COMPLETED SUCCESSFULLY.");
        } catch (Exception e) {
            System.out.println("Optimistic locking fix failed: " + e.getMessage());
        }
        System.out.println("=========================================");
    }
}
