package com.odisha.handloom.config;

import com.odisha.handloom.entity.Category;
import com.odisha.handloom.repository.CategoryRepository;
import com.odisha.handloom.entity.Shipment;
import com.odisha.handloom.repository.ShipmentRepository;
import com.odisha.handloom.entity.ShipmentBarcode;
import com.odisha.handloom.repository.ShipmentBarcodeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ShipmentRepository shipmentRepository;
    private final ShipmentBarcodeRepository shipmentBarcodeRepository; // Add field

    public DataSeeder(CategoryRepository categoryRepository,
            ShipmentRepository shipmentRepository,
            ShipmentBarcodeRepository shipmentBarcodeRepository) { // Update Constructor
        this.categoryRepository = categoryRepository;
        this.shipmentRepository = shipmentRepository;
        this.shipmentBarcodeRepository = shipmentBarcodeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            List<String> defaultCategories = Arrays.asList(
                    "Sarees",
                    "Fabrics",
                    "Handicrafts",
                    "Home Decor",
                    "Apparel");

            for (String catName : defaultCategories) {
                Category category = new Category();
                category.setName(catName);
                category.setDescription("Authentic Odisha " + catName);
                category.setImageUrl("/default_category_placeholder.png");
                categoryRepository.save(category);
            }
            System.out.println("✅ Default categories seeded successfully!");
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
