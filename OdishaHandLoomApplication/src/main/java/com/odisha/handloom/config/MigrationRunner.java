package com.odisha.handloom.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class MigrationRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(MigrationRunner.class);

    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource;

    public MigrationRunner(JdbcTemplate jdbcTemplate, DataSource dataSource) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("STARTING CUSTOM MIGRATION: Update Shipments Constraint");

        Resource resource = new ClassPathResource("update_shipments_status_constraint.sql");
        Resource coordResource = new ClassPathResource("add_shipment_coordinates.sql");

        try (Connection connection = dataSource.getConnection()) {
            ScriptUtils.executeSqlScript(connection, resource);
            ScriptUtils.executeSqlScript(connection, coordResource);
            logger.info("CUSTOM MIGRATION SUCCESSFUL: Shipments constraint updated.");
        } catch (Exception e) {
            logger.error("CUSTOM MIGRATION FAILED: ", e);
            // Optionally re-throw if it's critical, but for now we log it.
        }
    }
}
