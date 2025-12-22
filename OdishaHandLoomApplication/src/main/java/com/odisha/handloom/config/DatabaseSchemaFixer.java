package com.odisha.handloom.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSchemaFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running DatabaseSchemaFixer...");
        try {
            // Fix: email in 'otps' table should be nullable for Mobile Login
            jdbcTemplate.execute("ALTER TABLE otps ALTER COLUMN email DROP NOT NULL");
            System.out.println("Successfully altered 'otps.email' to be nullable.");
        } catch (Exception e) {
            System.out.println("Note: Could not alter 'otps.email' (might already be fixed): " + e.getMessage());
        }

        try {
            // Fix: mobile in 'otps' table should be nullable for Email Login
            jdbcTemplate.execute("ALTER TABLE otps ALTER COLUMN mobile DROP NOT NULL");
            System.out.println("Successfully altered 'otps.mobile' to be nullable.");
        } catch (Exception e) {
            System.out.println("Note: Could not alter 'otps.mobile': " + e.getMessage());
        }

        try {
            // Make type nullable as per recent fix requirement
            jdbcTemplate.execute("ALTER TABLE otps ALTER COLUMN type DROP NOT NULL");
            System.out.println("Successfully altered 'otps.type' to be nullable.");
        } catch (Exception e) {
            System.out.println("Note: Could not alter 'otps.type': " + e.getMessage());
        }

        try {
            // Make resend_at nullable as per recent fix requirement
            jdbcTemplate.execute("ALTER TABLE otps ALTER COLUMN resend_at DROP NOT NULL");
            System.out.println("Successfully altered 'otps.resend_at' to be nullable.");
        } catch (Exception e) {
            System.out.println("Note: Could not alter 'otps.resend_at': " + e.getMessage());
        }

        try {
            // Fix: Missing 'is_deleted' column in 'users' table
            jdbcTemplate
                    .execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE");
            System.out.println("Successfully added 'users.is_deleted' column.");
        } catch (Exception e) {
            System.out.println("Note: Could not add 'users.is_deleted': " + e.getMessage());
        }

        try {
            // Fix: Add 'account_holder_name' to users
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS account_holder_name VARCHAR(255)");
            System.out.println("Successfully added 'users.account_holder_name' column.");
        } catch (Exception e) {
            System.out.println("Note: Could not add 'users.account_holder_name': " + e.getMessage());
        }

        try {
            // Fix: Add 'is_bank_verified' to users
            jdbcTemplate.execute(
                    "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_bank_verified BOOLEAN NOT NULL DEFAULT FALSE");
            System.out.println("Successfully added 'users.is_bank_verified' column.");
            System.out.println("Successfully added 'users.is_bank_verified' column.");
        } catch (Exception e) {
            System.out.println("Note: Could not add 'users.is_bank_verified': " + e.getMessage());
        }

        try {
            // Fix: Add 'profile_picture_url' to users
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(255)");
            System.out.println("Successfully added 'users.profile_picture_url' column.");
        } catch (Exception e) {
            System.out.println("Note: Could not add 'users.profile_picture_url': " + e.getMessage());
        }

        try {
            // Fix: Add 'bio' to users
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT");
            System.out.println("Successfully added 'users.bio' column.");
        } catch (Exception e) {
            System.out.println("Note: Could not add 'users.bio': " + e.getMessage());
        }

        try {
            // Fix: Add 'gender' to users
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(50)");
            System.out.println("Successfully added 'users.gender' column.");
        } catch (Exception e) {
            System.out.println("Note: Could not add 'users.gender': " + e.getMessage());
        }

        /*
         * DISABLED HARD RESET: This was verifying schema but destroying data on every
         * startup.
         * Re-enable only if you strictly need to wipe the notifications table.
         *
         * try {
         * // HARD RESET: Drop and Recreate Notifications Table
         * System.out.println("Executing Hard Reset for Notifications Table...");
         * 
         * jdbcTemplate.execute("DROP TABLE IF EXISTS notifications CASCADE");
         * 
         * jdbcTemplate.execute("CREATE TABLE notifications (" +
         * "id UUID PRIMARY KEY, " +
         * "user_id UUID NOT NULL, " +
         * "sender_id UUID NULL, " +
         * "message TEXT NOT NULL, " +
         * "type VARCHAR(20) NOT NULL, " +
         * "is_read BOOLEAN DEFAULT FALSE, " +
         * "order_id UUID NULL, " +
         * "reel_id UUID NULL, " +
         * "comment_id UUID NULL, " +
         * "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
         * "CONSTRAINT notifications_type_check CHECK (type IN ('ORDER','FOLLOW','COMMENT','REEL','PAYOUT','SYSTEM'))"
         * +
         * ")");
         * 
         * System.out.
         * println("Successfully recreated 'notifications' table with clean schema.");
         * } catch (Exception e) {
         * System.out.println("Note: Could not reset 'notifications' table: " +
         * e.getMessage());
         * }
         */
    }
}
