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
                        // Helper to create FAQ
                        java.util.function.Function<String[], FAQ> create = (data) -> {
                                FAQ faq = new FAQ();
                                faq.setKeyword(data[0]);
                                faq.setAnswer(data[1]);
                                faq.setTargetRole(data[2]);
                                return faq;
                        };

                        List<FAQ> faqs = List.of(
                                        // General
                                        create.apply(new String[] { "login",
                                                        "You can login by clicking the Login button at the top right. Select your role (Customer/Seller).",
                                                        "ALL" }),
                                        create.apply(new String[] { "password",
                                                        "If you forgot your password, click 'Forgot Password' on the login screen to reset it.",
                                                        "ALL" }),

                                        // Customer
                                        create.apply(new String[] { "track",
                                                        "Go to 'My Orders' and click 'Track Order' to see the status of your shipment.",
                                                        "CUSTOMER" }),
                                        create.apply(new String[] { "return",
                                                        "You can request a return from 'My Orders' within 7 days of delivery.",
                                                        "CUSTOMER" }),
                                        create.apply(new String[] { "refund",
                                                        "Refunds are processed within 5-7 business days after the returned item is picked up.",
                                                        "CUSTOMER" }),

                                        // Seller
                                        create.apply(new String[] { "approval",
                                                        "Seller approval usually takes 24-48 hours. Please ensure your GST and Bank details are correct.",
                                                        "SELLER" }),
                                        create.apply(new String[] { "payment",
                                                        "Payouts are processed weekly for all delivered orders.",
                                                        "SELLER" }),
                                        create.apply(new String[] { "product",
                                                        "Go to 'My Products' and click 'Add New Product' to list your handloom items.",
                                                        "SELLER" }));

                        faqRepository.saveAll(faqs);
                        System.out.println("FAQ Data Seeded Successfully.");
                }
        }
}
