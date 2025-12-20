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
    public void sendOrderConfirmationEmail(String to, String name, String orderId, double amount,
            List<OrderItem> items) {
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

                <div style="text-align: center;">
                    <a href="http://localhost:5173/orders" class="button">Track Your Order</a>
                </div>
                """.formatted(name, orderId, amount, itemsHtml.toString());

        sendHtmlEmail(to, subject, getHtmlTemplate("Order Confirmation", content));
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

    @Async
    public void sendOtpEmail(String to, String otp) {
        String subject = "Your Login OTP - UdraKala";
        String content = """
                <p>Your One-Time Password (OTP) for login is:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ea580c; background: #fff7ed; padding: 10px 20px; border-radius: 8px; border: 1px dashed #ea580c;">%s</span>
                </div>
                <p>This OTP is valid for <strong>5 minutes</strong>.</p>
                <p style="color: #6b7280; font-size: 13px;">If you did not request this, please ignore this email.</p>
                """
                .formatted(otp);
        sendHtmlEmail(to, subject, getHtmlTemplate("Login Verification", content));
    }
}
