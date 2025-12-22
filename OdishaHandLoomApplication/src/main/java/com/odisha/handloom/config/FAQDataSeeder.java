package com.odisha.handloom.config;

import com.odisha.handloom.entity.FAQ;
import com.odisha.handloom.repository.FAQRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FAQDataSeeder implements CommandLineRunner {

    private final FAQRepository faqRepository;

    public FAQDataSeeder(FAQRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (faqRepository.count() == 0) {
            List<FAQ> faqs = List.of(
                    // General
                    FAQ.builder().keyword("login").answer(
                            "You can login by clicking the Login button at the top right. Select your role (Customer/Seller).")
                            .targetRole("ALL").build(),
                    FAQ.builder().keyword("password").answer(
                            "If you forgot your password, click 'Forgot Password' on the login screen to reset it.")
                            .targetRole("ALL").build(),

                    // Customer
                    FAQ.builder().keyword("track")
                            .answer("Go to 'My Orders' and click 'Track Order' to see the status of your shipment.")
                            .targetRole("CUSTOMER").build(),
                    FAQ.builder().keyword("return")
                            .answer("You can request a return from 'My Orders' within 7 days of delivery.")
                            .targetRole("CUSTOMER").build(),
                    FAQ.builder().keyword("refund").answer(
                            "Refunds are processed within 5-7 business days after the returned item is picked up.")
                            .targetRole("CUSTOMER").build(),

                    // Seller
                    FAQ.builder().keyword("approval").answer(
                            "Seller approval usually takes 24-48 hours. Please ensure your GST and Bank details are correct.")
                            .targetRole("SELLER").build(),
                    FAQ.builder().keyword("payment").answer("Payouts are processed weekly for all delivered orders.")
                            .targetRole("SELLER").build(),
                    FAQ.builder().keyword("product")
                            .answer("Go to 'My Products' and click 'Add New Product' to list your handloom items.")
                            .targetRole("SELLER").build());

            faqRepository.saveAll(faqs);
            System.out.println("FAQ Data Seeded Successfully.");
        }
    }
}
