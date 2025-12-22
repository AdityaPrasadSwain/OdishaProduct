package com.odisha.handloom.service;

import com.odisha.handloom.entity.Product;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class CaptionGeneratorService {

    private final Random random = new Random();

    public String generateCaption(Product product) {
        String category = product.getCategory() != null ? product.getCategory().getName() : "Handloom";

        List<String> templates = Arrays.asList(
                "Handcrafted elegance, woven with tradition 🤍\nTap to explore\n#IndianHandloom #UdraKala",
                "Where tradition meets timeless design ✨\nCrafted for you\n#Handcrafted #UdraKala #"
                        + category.replaceAll("\\s+", ""),
                "Not just fabric. It’s a story 📜\nSee details\n#IndianCraft #Handloom",
                "Authentic " + category + " from the artisans of Odisha 🪡\nTap to shop\n#OdishaHandloom #UdraKala",
                "Experience the magic of pure handloom 🌿\nMade with love\n#SustainableFashion #UdraKala");

        return templates.get(random.nextInt(templates.size()));
    }
}
