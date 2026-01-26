package com.odisha.handloom.configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class SchemaFixer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(SchemaFixer.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting SchemaFixer to ensure database integrity...");
        try {
            // 1. Ensure image_path exists
            try {
                jdbcTemplate.execute("ALTER TABLE product_images ADD COLUMN image_path TEXT");
                logger.info("Added image_path column.");
            } catch (Exception e) {
                // Ignore if exists
            }

            // 2. Migrate data
            try {
                jdbcTemplate.execute("UPDATE product_images SET image_path = image_url WHERE image_path IS NULL");
                logger.info("Migrated legacy data.");
            } catch (Exception e) {
                // Ignore
            }

            // 3. Make image_url NULLABLE (Safety First)
            // This ensures that even if we can't drop the column (due to dependencies
            // etc.),
            // the application won't crash on insert.
            try {
                jdbcTemplate.execute("ALTER TABLE product_images ALTER COLUMN image_url DROP NOT NULL");
                logger.info("Removed NOT NULL constraint from image_url.");
            } catch (Exception e) {
                logger.warn("Could not remove NOT NULL constraint from image_url (maybe column missing?): {}",
                        e.getMessage());
            }

            // 4. Try to DROP image_url
            try {
                jdbcTemplate.execute("ALTER TABLE product_images DROP COLUMN image_url");
                logger.info("Dropped legacy image_url column.");
            } catch (Exception e) {
                logger.warn("Could not drop image_url (dependencies?): {}", e.getMessage());
            }

            logger.info("SchemaFixer completed.");
        } catch (Exception e) {
            logger.warn("SchemaFixer global error: {}", e.getMessage());
        }
    }
}
