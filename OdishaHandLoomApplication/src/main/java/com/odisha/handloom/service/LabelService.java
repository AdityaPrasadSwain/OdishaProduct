package com.odisha.handloom.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.odisha.handloom.entity.Order;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class LabelService {

        // --- Public Methods ---

        public byte[] generateShippingLabel(Order order) {
                try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                        Document document = new Document(PageSize.A6, 10, 10, 10, 10);
                        PdfWriter writer = PdfWriter.getInstance(document, out);
                        document.open();

                        drawLabelPage(document, writer, order);

                        document.close();
                        return out.toByteArray();
                } catch (Exception e) {
                        e.printStackTrace();
                        throw new RuntimeException("Error generating label: " + e.getMessage(), e);
                }
        }

        public byte[] generateBulkShippingLabels(List<Order> orders) {
                if (orders == null || orders.isEmpty()) {
                        throw new IllegalArgumentException("No orders provided for bulk label generation");
                }

                try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                        Document document = new Document(PageSize.A6, 10, 10, 10, 10);
                        PdfWriter writer = PdfWriter.getInstance(document, out);
                        document.open();

                        for (int i = 0; i < orders.size(); i++) {
                                Order order = orders.get(i);
                                drawLabelPage(document, writer, order);

                                // Add new page if not the last order
                                if (i < orders.size() - 1) {
                                        document.newPage();
                                }
                        }

                        document.close();
                        return out.toByteArray();
                } catch (Exception e) {
                        e.printStackTrace();
                        throw new RuntimeException("Error generating bulk labels: " + e.getMessage(), e);
                }
        }

        // --- Private Helper Method (The Drawing Logic) ---

        private void drawLabelPage(Document document, PdfWriter writer, Order order) throws DocumentException {
                // --- FONTS ---
                Font brandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
                Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
                Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 8);
                Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9);
                Font hugeFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
                Font h1White = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, java.awt.Color.WHITE);
                Font normalWhite = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, java.awt.Color.WHITE);
                Font smallItalic = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 7);

                // --- DATA PREPARATION ---
                String trackingId = (order.getTrackingId() != null) ? order.getTrackingId() : "PENDING";
                String courierName = (order.getCourierName() != null) ? order.getCourierName() : "Standard";

                String customerName = (order.getUser() != null && order.getUser().getFullName() != null)
                                ? order.getUser().getFullName().toUpperCase()
                                : "CUSTOMER";
                String addressLine = (order.getShippingAddress() != null) ? order.getShippingAddress() : "Address N/A";

                // Pincode Extraction (Last 6 digits)
                String pincode = "000000";
                if (addressLine.matches(".*\\d{6}.*")) {
                        pincode = addressLine.replaceAll(".*?(\\d{6}).*", "$1");
                }

                String sellerName = (order.getSeller() != null && order.getSeller().getFullName() != null)
                                ? order.getSeller().getFullName()
                                : "Seller";

                String paymentMode = (order.getPaymentMethod() != null) ? order.getPaymentMethod() : "PREPAID";
                boolean isCod = "COD".equalsIgnoreCase(paymentMode);
                String amountText = isCod ? "Rs. " + (order.getTotalAmount() != null ? order.getTotalAmount() : "0")
                                : "0";

                // --- LAYOUT START ---

                // 1. HEADER (Brand + Payment Mode)
                PdfPTable headerTable = new PdfPTable(2);
                headerTable.setWidthPercentage(100);
                headerTable.setWidths(new float[] { 1.5f, 1.2f });

                // Branding
                PdfPCell brandingCell = new PdfPCell();
                brandingCell.setBorder(Rectangle.BOX);
                brandingCell.setBorderWidth(1.2f);
                brandingCell.setPadding(5);
                brandingCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                brandingCell.addElement(new Paragraph("UDRAKALA", brandFont));
                headerTable.addCell(brandingCell);

                // COD Box (Black Background)
                PdfPCell paymentCell = new PdfPCell();
                paymentCell.setBorder(Rectangle.BOX);
                paymentCell.setBorderWidth(1.2f);
                if (isCod) {
                        paymentCell.setBackgroundColor(java.awt.Color.BLACK);
                }
                paymentCell.setPadding(5);
                paymentCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                paymentCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

                Paragraph modePara = new Paragraph(isCod ? "COD" : "PREPAID", isCod ? h1White : hugeFont);
                modePara.setAlignment(Element.ALIGN_CENTER);
                paymentCell.addElement(modePara);

                Paragraph collectPara = new Paragraph(isCod ? "Collect: " + amountText : "Do not Collect",
                                isCod ? normalWhite : normalFont);
                collectPara.setAlignment(Element.ALIGN_CENTER);
                paymentCell.addElement(collectPara);

                headerTable.addCell(paymentCell);

                document.add(headerTable);
                document.add(new Paragraph("\n"));

                // 2. SPLIT TABLE (Customer Address vs Courier Info)
                PdfPTable splitTable = new PdfPTable(2);
                splitTable.setWidthPercentage(100);
                splitTable.setWidths(new float[] { 1.3f, 0.7f }); // 65% Left, 35% Right

                // --- LEFT COLUMN: Deliver To & From ---
                PdfPCell leftCell = new PdfPCell();
                leftCell.setBorder(Rectangle.BOX);
                leftCell.setBorderWidth(1.2f);
                leftCell.setPadding(5);
                leftCell.setPaddingBottom(10);

                // To
                leftCell.addElement(new Paragraph("Customer Address:", titleFont));
                leftCell.addElement(new Paragraph(customerName, boldFont));
                leftCell.addElement(new Paragraph(addressLine, normalFont));
                leftCell.addElement(new Paragraph(
                                "Mob: " + (order.getUser() != null ? order.getUser().getPhoneNumber() : "N/A"),
                                normalFont));

                leftCell.addElement(new Paragraph("\n"));

                // From (Returns)
                leftCell.addElement(new Paragraph("If undelivered, return to:", titleFont));
                leftCell.addElement(new Paragraph("Udrakala Returns Hub", boldFont));
                leftCell.addElement(new Paragraph("C/O " + sellerName, normalFont));
                leftCell.addElement(new Paragraph("Odisha, India - 751006", normalFont));

                splitTable.addCell(leftCell);

                // --- RIGHT COLUMN: Courier, Barcode, Routing ---
                PdfPCell rightCell = new PdfPCell();
                rightCell.setBorder(Rectangle.BOX);
                rightCell.setBorderWidth(1.2f);
                rightCell.setPadding(2);
                rightCell.setHorizontalAlignment(Element.ALIGN_CENTER);

                // Courier Name
                Paragraph courierP = new Paragraph(courierName.toUpperCase(), titleFont);
                courierP.setAlignment(Element.ALIGN_CENTER);
                rightCell.addElement(courierP);

                // Pickup Badge
                PdfPTable badgeTable = new PdfPTable(1);
                badgeTable.setWidthPercentage(60);
                PdfPCell badgeCell = new PdfPCell(new Phrase("PICKUP", smallItalic));
                badgeCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                badgeCell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                badgeCell.setBorder(Rectangle.NO_BORDER);
                badgeTable.addCell(badgeCell);
                rightCell.addElement(badgeTable);

                rightCell.addElement(new Paragraph("\n"));

                // Pincode / Routing
                Paragraph pinP = new Paragraph("DEST: " + pincode, boldFont);
                pinP.setAlignment(Element.ALIGN_CENTER);
                rightCell.addElement(pinP);
                rightCell.addElement(new Paragraph("RET: 751006", normalFont));

                // QR Code at Top Right
                try {
                        QRCodeWriter qrCodeWriter = new QRCodeWriter();
                        BitMatrix bitMatrix = qrCodeWriter.encode(trackingId, BarcodeFormat.QR_CODE, 80, 80);
                        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
                        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
                        Image qrImage = Image.getInstance(pngOutputStream.toByteArray());
                        qrImage.setAlignment(Element.ALIGN_CENTER);
                        rightCell.addElement(qrImage);
                } catch (Exception e) {
                        e.printStackTrace();
                }

                // Tracking ID Text
                Paragraph trackText = new Paragraph(trackingId, boldFont);
                trackText.setAlignment(Element.ALIGN_CENTER);
                rightCell.addElement(trackText);

                // Barcode 128 at Bottom Right
                try {
                        Barcode128 barcode = new Barcode128();
                        barcode.setCode(trackingId);
                        barcode.setFont(null);
                        barcode.setBarHeight(30f);
                        barcode.setX(1f);

                        Image img = barcode.createImageWithBarcode(writer.getDirectContent(), null, null);
                        img.setAlignment(Element.ALIGN_CENTER);
                        rightCell.addElement(img);

                } catch (Exception e) {
                        // Ignore
                }

                splitTable.addCell(rightCell);
                document.add(splitTable);

                document.add(new Paragraph("\n"));

                // 3. PRODUCT TABLE
                PdfPTable productTable = new PdfPTable(4);
                productTable.setWidthPercentage(100);
                productTable.setWidths(new float[] { 2f, 0.5f, 1f, 1.5f });

                PdfPCell h1 = new PdfPCell(new Phrase("Product / SKU", boldFont));
                h1.setBorderWidthBottom(1.2f);
                productTable.addCell(h1);

                PdfPCell h2 = new PdfPCell(new Phrase("Qty", boldFont));
                h2.setBorderWidthBottom(1.2f);
                productTable.addCell(h2);

                PdfPCell h3 = new PdfPCell(new Phrase("Color", boldFont));
                h3.setBorderWidthBottom(1.2f);
                productTable.addCell(h3);

                PdfPCell h4 = new PdfPCell(new Phrase("Order No", boldFont));
                h4.setBorderWidthBottom(1.2f);
                productTable.addCell(h4);

                // Items
                if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
                        for (var item : order.getOrderItems()) {
                                productTable.addCell(new Phrase(item.getProduct().getName(), normalFont));
                                productTable.addCell(new Phrase(String.valueOf(item.getQuantity()), normalFont));
                                productTable.addCell(new Phrase("N/A", normalFont));
                                productTable.addCell(new Phrase(order.getId().toString().substring(0, 8), normalFont));
                        }
                } else {
                        PdfPCell empty = new PdfPCell(new Phrase("No Items", normalFont));
                        empty.setColspan(4);
                        productTable.addCell(empty);
                }

                document.add(productTable);

                // Footer
                Paragraph footer = new Paragraph("Use Camera to Scan QR • System Generated", smallItalic);
                footer.setAlignment(Element.ALIGN_CENTER);
                document.add(footer);
        }
}
