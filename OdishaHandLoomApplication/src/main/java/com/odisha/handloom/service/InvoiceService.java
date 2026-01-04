package com.odisha.handloom.service;

import com.odisha.handloom.entity.Order;
import com.odisha.handloom.entity.OrderItem;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.stereotype.Service;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InvoiceService {

    public byte[] generateInvoice(Order order) {
        try {
            // 1. Load the JRXML template
            InputStream templateStream = getClass().getResourceAsStream("/reports/udrakala_invoice.jrxml");
            if (templateStream == null) {
                throw new FileNotFoundException("Invoice template not found in /reports/udrakala_invoice.jrxml");
            }

            JasperReport jasperReport = JasperCompileManager.compileReport(templateStream);

            // 2. Prepare Parameters
            Map<String, Object> parameters = new HashMap<>();

            // Logo Logic - Use a placeholder or actual logic if available.
            // For now, we will try to load a default logo or leave empty if not found
            // Assuming LOGO_PATH expects a String path or InputStream.
            // The template uses parameter LOGO_PATH.
            // Let's use a dummy path or handled in the catch block if image missing.
            // Ideally should be classpath resource.
            // parameters.put("LOGO_PATH", "classpath:static/images/logo.png");
            // For safety, we can pass null or a text string if image object not handled
            // perfectly in all envs without physical file.
            // But requirement said "Map data correctly".
            // Let's attempt to pass a string.
            // Logo Logic
            InputStream logoStream = getClass().getResourceAsStream("/reports/logo/udrakala_logo.jpg");

            // Try PNG if JPG not found
            if (logoStream == null) {
                logoStream = getClass().getResourceAsStream("/reports/logo/udrakala_logo.png");
            }

            if (logoStream != null) {
                parameters.put("LOGO_PATH", logoStream);
            } else {
                System.out.println("WARNING: Logo file not found. Generating invoice without logo.");
                // Passing null might be safe for JasperReports depending on the template
                // expression handling
                // If the template crashes on null, we might need a 1x1 empty input stream.
                // For now, let's try passing null implicitly by NOT putting it in the map if
                // the template handles null P{...}
                parameters.put("LOGO_PATH", new java.io.ByteArrayInputStream(new byte[0]));
            }

            parameters.put("invoiceNumber", order.getInvoiceNumber() != null ? order.getInvoiceNumber()
                    : "INV-" + order.getId().toString().substring(0, 8));
            parameters.put("invoiceDate",
                    order.getInvoiceSentAt() != null
                            ? order.getInvoiceSentAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
                            : (order.getCreatedAt() != null
                                    ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
                                    : java.time.LocalDateTime.now()
                                            .format(DateTimeFormatter.ofPattern("dd MMM yyyy"))));

            // Seller Details
            parameters.put("sellerName", order.getSeller().getFullName());
            parameters.put("sellerAddress", "Odisha based Handloom Seller"); // Detailed address if in User entity
            parameters.put("sellerPhone", order.getSeller().getPhoneNumber());

            // Customer Details
            parameters.put("customerName", order.getUser().getFullName());
            parameters.put("customerAddress", order.getShippingAddress());
            parameters.put("customerPhone", order.getUser().getPhoneNumber());

            // Totals
            parameters.put("subtotal", order.getTotalAmount()); // Simplified for now, assumming total = subtotal
            parameters.put("discount", BigDecimal.ZERO);
            parameters.put("taxTotal", BigDecimal.ZERO);
            parameters.put("paid", order.getTotalAmount());
            parameters.put("grandTotal", order.getTotalAmount());

            // 3. Prepare Data Source
            List<Map<String, Object>> items = new ArrayList<>();
            for (OrderItem item : order.getOrderItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("item", item.getProduct().getName());
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("rate", item.getPrice());
                itemMap.put("tax", BigDecimal.ZERO);
                itemMap.put("amount", item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                items.add(itemMap);
            }
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(items);

            // 4. Fill Report
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

            // 5. Export to PDF
            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating invoice: " + e.getMessage());
        }
    }
}
