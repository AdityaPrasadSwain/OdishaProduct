package com.odisha.handloom.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.MessagingException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.List;
import com.odisha.handloom.entity.OrderItem;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            System.out.println("Email sent successfully to " + to);
        } catch (Exception e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true indicates HTML

            mailSender.send(message);
            System.out.println("HTML Email sent successfully to " + to);
        } catch (MessagingException e) {
            System.err.println("Error sending HTML email to " + to + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String getHtmlTemplate(String title, String content) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
                        .container { max-width: 600px; margin: 20px auto; padding: 0; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background-color: #ea580c; padding: 20px; text-align: center; }
                        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
                        .content { padding: 30px 20px; }
                        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
                        .button { display: inline-block; padding: 12px 24px; background-color: #ea580c; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; text-align: center; }
                        .info-box { background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 15px; margin: 20px 0; border-radius: 4px; }
                        .table-container { width: 100%%; overflow-x: auto; }
                        table { width: 100%%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
                        th, td { padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: left; }
                        th { background-color: #f9fafb; font-weight: 600; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>%s</h1>
                        </div>
                        <div class="content">
                            %s
                        </div>
                        <div class="footer">
                            <p>&copy; 2025 UdraKala. All rights reserved.</p>
                            <p>Celebrating the Art of Odisha</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(title, content);
    }

    @Async
    public void sendCustomerWelcomeEmail(String to, String name) {
        String subject = "Welcome to UdraKala!";
        String content = """
                <p>Dear <strong>%s</strong>,</p>
                <p>Welcome to <strong>UdraKala</strong> - The authentic home of Odisha's handloom and handicrafts.</p>
                <p>We are thrilled to have you join our community. Your account has been successfully created.</p>
                <div class="info-box">
                    <strong>What's Next?</strong>
                    <ul>
                        <li>Browse our exclusive collection of Sambalpuri, Maniabandha, and more.</li>
                        <li>Add your favorite items to your wishlist.</li>
                        <li>Experience seamless shopping with secure payments.</li>
                    </ul>
                </div>
                <div style="text-align: center;">
                    <a href="http://localhost:5173/" class="button">Start Shopping</a>
                </div>
                """.formatted(name);

        sendHtmlEmail(to, subject, getHtmlTemplate("Welcome to UdraKala", content));
    }

    // Deprecated: Use sendCustomerWelcomeEmail instead
    @Async
    public void sendWelcomeEmail(String to, String name) {
        sendCustomerWelcomeEmail(to, name);
    }

    @Async
    public void sendOrderConfirmationEmail(String to, String name, String orderId, java.math.BigDecimal amount,
            List<OrderItem> items, byte[] invoicePdf) {
        String subject = "Order Confirmed! Order #" + orderId;

        StringBuilder itemsHtml = new StringBuilder();
        itemsHtml.append("<table><tr><th>Product</th><th>Qty</th><th>Price</th></tr>");
        for (OrderItem item : items) {
            itemsHtml.append("<tr>")
                    .append("<td>").append(item.getProduct().getName()).append("</td>")
                    .append("<td>").append(item.getQuantity()).append("</td>")
                    .append("<td>₹").append(item.getPrice()).append("</td>")
                    .append("</tr>");
        }
        itemsHtml.append("</table>");

        String content = """
                <p>Dear <strong>%s</strong>,</p>
                <p>Thank you for your order! We have received your order and it is being processed.</p>

                <div class="info-box">
                    <p style="margin: 5px 0;"><strong>Order ID:</strong> %s</p>
                    <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹%.2f</p>
                </div>

                <h3>Order Summary</h3>
                <div class="table-container">
                    %s
                </div>

                <p>We will notify you once your items are shipped.</p>
                <p><strong>Please find your invoice attached.</strong></p>

                <div style="text-align: center;">
                    <a href="http://localhost:5173/orders" class="button">Track Your Order</a>
                </div>
                """.formatted(name, orderId, amount, itemsHtml.toString());

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(getHtmlTemplate("Order Confirmation", content), true);

            if (invoicePdf != null) {
                helper.addAttachment("Invoice_" + orderId + ".pdf",
                        new jakarta.mail.util.ByteArrayDataSource(invoicePdf, "application/pdf"));
            }

            mailSender.send(message);
            System.out.println("✅ Order Confirmation Email (with Invoice) sent to " + to);
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send order confirmation email to " + to + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendReturnRequestSubmittedEmail(String to, String name, String orderId, String productName) {
        String subject = "Return Request Submitted - Order #" + orderId;
        String content = """
                <p>Dear <strong>%s</strong>,</p>
                <p>We have received your return request for <strong>%s</strong> from Order #%s.</p>
                <p>Our team will review your request within 24-48 hours. You will be notified via email once the request is approved or if we need more information.</p>

                <div style="text-align: center;">
                    <a href="http://localhost:5173/orders/%s" class="button">View Return Status</a>
                </div>
                """
                .formatted(name, productName, orderId, orderId);

        sendHtmlEmail(to, subject, getHtmlTemplate("Return Request Received", content));
    }

    @Async
    public void sendReplacementRequestSubmittedEmail(String to, String name, String orderId, String productName) {
        String subject = "Replacement Request Submitted - Order #" + orderId;
        String content = """
                <p>Dear <strong>%s</strong>,</p>
                <p>We have received your replacement request for <strong>%s</strong> from Order #%s.</p>
                <p>Our team is reviewing the issue. Once approved, we will initiate the pickup of the item and ship the replacement.</p>

                <div style="text-align: center;">
                    <a href="http://localhost:5173/orders/%s" class="button">View Replacement Status</a>
                </div>
                """
                .formatted(name, productName, orderId, orderId);

        sendHtmlEmail(to, subject, getHtmlTemplate("Replacement Request Received", content));
    }

    @Async
    public void sendNewOrderReceivedEmail(String to, String sellerName, String orderId, String customerName) {
        String subject = "New Order Received! Order #" + orderId;
        String content = """
                <p>Dear <strong>%s</strong>,</p>
                <p>Great news! You have received a new order from <strong>%s</strong>.</p>

                <div class="info-box">
                    <p style="margin: 5px 0;"><strong>Order ID:</strong> %s</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> PENDING</p>
                </div>

                <p>Please log in to your seller dashboard to review the order details and start packing.</p>

                <div style="text-align: center;">
                    <a href="http://localhost:5173/seller/orders" class="button">Manage Order</a>
                </div>
                """.formatted(sellerName, customerName, orderId);

        sendHtmlEmail(to, subject, getHtmlTemplate("New Order Notification", content));
    }

    @Async
    public void sendSellerReturnRequestEmail(String to, String sellerName, String orderId, String productName,
            String type) {
        String subject = type + " Request Received - Order #" + orderId;
        String content = """
                <p>Dear <strong>%s</strong>,</p>
                <p>A customer has requested a <strong>%s</strong> for the item: <strong>%s</strong> (Order #%s).</p>

                <div class="info-box">
                    <p>Please review this request within 48 hours.</p>
                </div>

                <div style="text-align: center;">
                    <a href="http://localhost:5173/seller/returns" class="button">Review Request</a>
                </div>
                """.formatted(sellerName, type, productName, orderId);

        sendHtmlEmail(to, subject, getHtmlTemplate("Return Action Required", content));
    }

    @Async
    public void sendSellerApprovalEmail(String to, String name) {
        String subject = "Congratulations! Your Seller Account is Approved - UdraKala";
        String content = """
                <p>Dear <strong>%s</strong>,</p>
                <p>We are delighted to inform you that your seller account on <strong>UdraKala</strong> has been successfully <strong style="color: #16a34a;">APPROVED</strong>!</p>

                <div class="info-box">
                    <p>You can now log in to your seller dashboard to:</p>
                    <ul>
                        <li>List and manage your unique handloom products.</li>
                        <li>Track your orders and revenue.</li>
                        <li>Connect with customers across the globe.</li>
                    </ul>
                </div>

                <p>We are excited to have you onboard and look forward to showcasing the finest art of Odisha to the world together.</p>

                <div style="text-align: center;">
                    <a href="http://localhost:5173/login" class="button">Access Seller Dashboard</a>
                </div>
                """
                .formatted(name);

        sendHtmlEmail(to, subject, getHtmlTemplate("Welcome to UdraKala Family!", content));
    }

    @Async
    public void sendSellerRejectionEmail(String to, String name, String reason) {
        String subject = "Update Regarding Your Seller Account - UdraKala";
        String content = """
                <p>Dear <strong>%s</strong>,</p>
                <p>Thank you for your interest in joining UdraKala as a seller.</p>
                <p>After carefully reviewing your application, we regret to inform you that we are unable to approve your seller account at this time.</p>

                <div class="info-box" style="border-left-color: #dc2626; background-color: #fef2f2;">
                    <strong>Reason:</strong>
                    <p style="margin-top: 5px;">%s</p>
                </div>

                <p>If you believe this decision was made in error or if you have rectified the issues mentioned, please contact our support team or re-apply.</p>

                <div style="text-align: center;">
                    <a href="mailto:support@udrakala.com" class="button" style="background-color: #6b7280;">Contact Support</a>
                </div>
                """
                .formatted(name, reason != null ? reason : "Application criteria not met.");

        sendHtmlEmail(to, subject, getHtmlTemplate("Account Status Update", content));
    }

    /**
     * Synchronous OTP Email Sending (Strict Requirement).
     * Throws exception on failure.
     */
    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Your OTP – UdraKala");

            String htmlContent = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Your OTP – UdraKala</title>
                        <style>
                            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; color: #333333; line-height: 1.6; }
                            table { border-collapse: collapse; width: 100%%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                            .header { background-color: #ea580c; padding: 28px 20px; text-align: center; }
                            .header h1 { color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 1px; }
                            .sub-header { color: #fbbf24; font-size: 13px; text-transform: uppercase; margin-top: 6px; }
                            .content { padding: 40px 20px; text-align: center; }
                            .content h2 { color: #ea580c; font-size: 22px; margin-bottom: 16px; }
                            .otp-box { background-color: #f9fafb; border: 2px dashed #ea580c; border-radius: 8px; padding: 18px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #111827; display: inline-block; margin: 20px 0; }
                            .info-text { font-size: 14px; color: #374151; margin-top: 10px; }
                            .warning { margin-top: 20px; font-size: 13px; color: #6b7280; }
                            .footer { background-color: #f9fafb; padding: 25px 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
                            @media only screen and (max-width: 480px) { .content { padding: 25px 16px; } .otp-box { font-size: 24px; letter-spacing: 4px; } }
                        </style>
                    </head>
                    <body>
                    <table role="presentation" cellspacing="0" cellpadding="0">
                        <!-- Header -->
                        <tr>
                            <td class="header">
                                <h1>UDRAKALA</h1>
                                <div class="sub-header">The Art of Odisha</div>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td class="content">
                                <h2>Verify Your Login</h2>
                                <p>Hello <strong>User</strong>,</p>
                                <p>Please use the following One-Time Password (OTP) to continue:</p>
                                <!-- OTP -->
                                <div class="otp-box">
                                    %s
                                </div>
                                <p class="info-text">
                                    This OTP is valid for <strong>5 minutes</strong>.
                                </p>
                                <p class="warning">
                                    Do not share this OTP with anyone.
                                    UdraKala team will never ask for your OTP.
                                </p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td class="footer">
                                <p>&copy; 2025 UdraKala. All rights reserved.</p>
                                <p>If you didn’t request this OTP, you can safely ignore this email.</p>
                            </td>
                        </tr>
                    </table>
                    </body>
                    </html>
                    """
                    .formatted(otp);

            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);
            System.out.println("✅ OTP Email sent successfully to " + to);

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send OTP email to " + to + ": " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email", e);
        } catch (Exception e) {
            System.err.println("❌ Unexpected error sending OTP email: " + e.getMessage());
            throw new RuntimeException("Unexpected error sending OTP email", e);
        }
    }

    // Deprecated Async OTP method - keeping for legacy code ensuring it calls new
    // one or is removed
    // Removing @Async to force synchronous behavior if called
    public void sendOtpEmail(String to, String name, String otp) {
        sendOtpEmail(to, otp);
    }

    @Value("${app.otp.mode:DEV}")
    private String otpMode;

    @org.springframework.context.event.EventListener(org.springframework.boot.context.event.ApplicationReadyEvent.class)
    public void sendStartupTestEmail() {
        if ("PROD".equalsIgnoreCase(otpMode)) {
            System.out.println("🚀 Sending Startup Test Email (PROD Mode)...");
            try {
                sendOtpEmail(fromEmail, "TEST-STARTUP");
                System.out.println("✅ Startup Test Email PASSED.");
            } catch (Exception e) {
                System.err.println("❌ Startup Test Email FAILED: " + e.getMessage());
            }
        } else {
            System.out.println("🚀 Startup Test Email skipped in DEV. Set app.otp.mode=PROD to test.");
        }
    }

    @Async
    public void sendThankYouInvoiceEmail(String to, String customerName, String orderId, byte[] invoicePdf) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Thank you for your UdraKala order – Invoice attached");

            String content = """
                    <p>Dear <strong>%s</strong>,</p>
                    <p>Thank you for shopping with <strong>UdraKala</strong>!</p>
                    <p>We are pleased to inform you that your order <strong>#%s</strong> is being processed and will be shipped soon.</p>
                    <p>Please find the attached invoice for your reference.</p>

                    <div class="info-box">
                        <p>If you have any questions, feel free to reply to this email or contact us at <a href="mailto:support@udrakala.com">support@udrakala.com</a>.</p>
                    </div>

                    <div style="text-align: center;">
                        <a href="http://localhost:5173/orders/%s" class="button">View Order Details</a>
                    </div>
                    """
                    .formatted(customerName, orderId, orderId);

            helper.setText(getHtmlTemplate("Invoice for Order #" + orderId, content), true);

            // Add Attachment
            helper.addAttachment("Invoice_" + orderId + ".pdf",
                    new jakarta.mail.util.ByteArrayDataSource(invoicePdf, "application/pdf"));

            mailSender.send(message);
            System.out.println("✅ Invoice Email sent successfully to " + to);

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send invoice email to " + to + ": " + e.getMessage());
            e.printStackTrace(); // Log full trace for debugging
        } catch (Exception e) {
            System.err.println("❌ Unexpected error sending invoice email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendOutOfStockAcknowledgementEmail(String to, String productName) {
        String subject = "Product Currently Unavailable – We’ll Keep You Updated";
        String content = """
                <p>Dear Customer,</p>
                <p>Thank you for your interest in <strong>%s</strong>.</p>
                <div class="info-box">
                    <p>This product is currently out of stock.</p>
                    <p>As soon as it becomes available again, we will notify you.</p>
                </div>
                <p>Thank you for choosing us.</p>
                """.formatted(productName);

        sendHtmlEmail(to, subject, getHtmlTemplate("We’ll Keep You Updated", content));
    }

    @Async
    public void sendProductAvailableTodayEmail(String to, String productName, String productId) {
        String subject = "Good News! Your Product Is Available Today";
        String content = """
                <p>Dear Customer,</p>
                <p>We’re happy to let you know that the product you were waiting for, <strong>%s</strong>, is now available today.</p>

                <div class="info-box" style="background-color: #f0fdf4; border-left-color: #16a34a;">
                   <strong>Available Now!</strong>
                </div>

                <p>Thank you for your patience and for choosing us.</p>

                <div style="text-align: center;">
                    <a href="http://localhost:5173/product/%s" class="button">Shop Now</a>
                </div>
                """
                .formatted(productName, productId);

        sendHtmlEmail(to, subject, getHtmlTemplate("Good News!", content));
    }

    @Async
    public void sendOrderFormattedEmail(String to, String subject, String bodyContent, String name) {
        String content = """
                <p>Dear <strong>%s</strong>,</p>
                <p>%s</p>
                <div style="text-align: center;">
                    <a href="http://localhost:5173/orders" class="button">View Order</a>
                </div>
                """
                .formatted(name, bodyContent);

        sendHtmlEmail(to, subject, getHtmlTemplate(subject, content));
    }
}
