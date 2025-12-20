package com.odisha.handloom.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

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
    public void sendWelcomeEmail(String to, String name) {
        String subject = "Welcome to UdraKala!";
        String body = "Dear " + name + ",\n\n" +
                "Welcome to UdraKala - The Art of Odisha!\n\n" +
                "We are thrilled to have you join our community celebrating the rich heritage of Odisha's handloom and handicrafts.\n\n"
                +
                "You can now explore our exclusive collection and start shopping.\n\n" +
                "Best Regards,\n" +
                "The UdraKala Team";
        sendEmail(to, subject, body);
    }
}
