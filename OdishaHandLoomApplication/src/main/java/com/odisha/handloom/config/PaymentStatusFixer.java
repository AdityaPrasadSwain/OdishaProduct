package com.odisha.handloom.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class PaymentStatusFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking for payments_status_check constraint update...");

        try {
            // Drop the old constraint
            jdbcTemplate.execute("ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check");

            // Add the updated constraint
            // We use raw SQL to ensure the DB accepts the new values
            String sql = "ALTER TABLE payments ADD CONSTRAINT payments_status_check CHECK (status IN ('PENDING', 'INITIATED', 'AWAITING_CONFIRMATION', 'SUCCESS', 'FAILED', 'REFUNDED', 'CANCELLED', 'COD_PENDING_DELIVERY', 'COD_DELIVERED'))";

            jdbcTemplate.execute(sql);

            System.out.println("Updated payments_status_check constraint successfully to allow COD statuses.");
        } catch (Exception e) {
            System.out.println("Warning during payment status fix: " + e.getMessage());
        }
    }
}
