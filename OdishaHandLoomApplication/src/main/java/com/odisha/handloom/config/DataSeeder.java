package com.odisha.handloom.config;

import com.odisha.handloom.entity.Category;
import com.odisha.handloom.repository.CategoryRepository;
import com.odisha.handloom.entity.Shipment;
import com.odisha.handloom.repository.ShipmentRepository;
import com.odisha.handloom.entity.ShipmentBarcode;
import com.odisha.handloom.repository.ShipmentBarcodeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import org.springframework.jdbc.core.JdbcTemplate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ShipmentRepository shipmentRepository;
    private final ShipmentBarcodeRepository shipmentBarcodeRepository; // Add field
    private final JdbcTemplate jdbcTemplate;

    public DataSeeder(CategoryRepository categoryRepository,
            ShipmentRepository shipmentRepository,
            ShipmentBarcodeRepository shipmentBarcodeRepository,
            JdbcTemplate jdbcTemplate) { // Update Constructor
        this.categoryRepository = categoryRepository;
        this.shipmentRepository = shipmentRepository;
        this.shipmentBarcodeRepository = shipmentBarcodeRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        // We are no longer seeding categories.
        // Instead, we will clean up existing categories to ensure the table is empty.
        long categoryCount = categoryRepository.count();
        if (categoryCount > 0) {
            System.out.println("Cleaning up existing categories...");
            // First, nullify category associations in products to avoid foreign key constraint violations
            jdbcTemplate.update("UPDATE products SET category_id = NULL");
            // Then delete all categories
            categoryRepository.deleteAll();
            System.out.println("✅ " + categoryCount + " categories removed successfully!");
        }

        // Backfill Shipments with missing barcode
        List<Shipment> shipments = shipmentRepository.findAll();
        for (Shipment s : shipments) {
            boolean changed = false;
            // 1. Ensure Shipment has barcodeValue
            if (s.getBarcodeValue() == null) {
                String trk = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                s.setBarcodeValue("UDR|SHIP|" + trk);
                changed = true;
            }

            // 2. Ensure ShipmentBarcode record exists (New Table)
            if (shipmentBarcodeRepository.findByShipmentId(s.getId()).isEmpty()) {
                String val = s.getBarcodeValue();
                String trk;
                if (val.startsWith("UDR|SHIP|")) {
                    trk = val.replace("UDR|SHIP|", "");
                } else {
                    trk = val; // fallback for legacy
                }

                ShipmentBarcode sb = new ShipmentBarcode(s.getId(), trk, val);
                shipmentBarcodeRepository.save(sb);
                System.out.println("✅ Synced ShipmentBarcode for: " + s.getId());
            }

            if (changed) {
                shipmentRepository.save(s);
            }
        }
    }
}
