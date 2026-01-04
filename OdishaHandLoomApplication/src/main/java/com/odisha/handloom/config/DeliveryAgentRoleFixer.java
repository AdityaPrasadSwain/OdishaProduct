package com.odisha.handloom.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class DeliveryAgentRoleFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Checking for users_role_check constraint...");

        try {
            // Attempt to drop the constraint if it exists.
            // Postgres doesn't support "IF EXISTS" for constraints in older versions
            // gracefully in all dialects,
            // but we can try catch or just run it. Using simple SQL.
            jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
            System.out.println("Constraint dropped.");

            // Force update the test user to DELIVERY_AGENT
            String updateSql = "UPDATE users SET role = 'DELIVERY_AGENT' WHERE phone_number = '7848973332'";
            int rows = jdbcTemplate.update(updateSql);
            System.out.println("Updated test user role to DELIVERY_AGENT. Rows affected: " + rows);

        } catch (Exception e) {
            System.out.println("Constraint might not exist or failed to drop: " + e.getMessage());
        }
    }
}
