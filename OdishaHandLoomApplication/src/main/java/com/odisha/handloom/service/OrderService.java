package com.odisha.handloom.service;

import com.odisha.handloom.entity.*;
import com.odisha.handloom.payload.request.OrderItemRequest;
import com.odisha.handloom.repository.OrderRepository;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.repository.AddressRepository;
import com.odisha.handloom.repository.SellerEarningsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.odisha.handloom.service.InvoiceService;
import com.odisha.handloom.service.EmailService;
import java.time.LocalDateTime;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private SellerEarningsRepository sellerEarningsRepository;

    @Autowired
    private com.odisha.handloom.repository.PlatformConfigRepository platformConfigRepository;

    @Autowired
    private AdminNotificationService adminNotificationService;

    @Transactional
    public List<Order> createOrder(User customer, List<OrderItemRequest> items, String address, String paymentMethod,
            String paymentId, UUID addressId) {
        // Group items by Seller (Product -> Seller)
        List<TempItem> tempItems = new ArrayList<>();

        for (OrderItemRequest itemReq : items) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            tempItems.add(new TempItem(product, itemReq.getQuantity()));
        }

        // Group by Seller
        Map<User, List<TempItem>> itemsBySeller = tempItems.stream()
                .collect(Collectors.groupingBy(item -> item.product.getSeller()));

        System.out.println("[OrderService] Found " + itemsBySeller.size() + " unique sellers for this order.");

        List<Order> createdOrders = new ArrayList<>();

        for (Map.Entry<User, List<TempItem>> entry : itemsBySeller.entrySet()) {
            User seller = entry.getKey();
            List<TempItem> sellerItems = entry.getValue();

            System.out.println(
                    "[OrderService] Creating order for seller: " + seller.getEmail() + " (ID: " + seller.getId() + ")");

            Order order = new Order();
            order.setUser(customer);
            order.setSeller(seller);
            order.setStatus(OrderStatus.PENDING);

            // Logic to handle address
            if (addressId != null) {
                Address savedAddress = addressRepository.findById(addressId).orElse(null);
                if (savedAddress != null) {
                    order.setAddressId(addressId);
                    // Create formatted string for snapshot
                    String formattedAddress = String.format("%s, %s, %s - %s",
                            savedAddress.getStreet(), savedAddress.getCity(),
                            savedAddress.getState(), savedAddress.getZipCode());
                    order.setShippingAddress(formattedAddress);
                } else {
                    order.setShippingAddress(address);
                }
            } else {
                order.setShippingAddress(address);
            }

            order.setPaymentMethod(paymentMethod);
            order.setPaymentId(paymentId);

            BigDecimal totalAmount = BigDecimal.ZERO;
            List<OrderItem> orderItems = new ArrayList<>();

            for (TempItem temp : sellerItems) {
                Product product = temp.product;
                int qty = temp.quantity;

                // Deduct stock
                product.setStockQuantity(product.getStockQuantity() - qty);
                productRepository.save(product);

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(qty);
                orderItem.setPrice(product.getPrice());

                orderItems.add(orderItem);
                totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(qty)));
            }

            order.setOrderItems(orderItems);
            order.setTotalAmount(totalAmount);

            Order savedOrder = orderRepository.save(order);
            createdOrders.add(savedOrder);
            System.out.println("[OrderService] Order saved with ID: " + savedOrder.getId());

            // Calculate and Save Seller Earnings (Dynamic Commission + GST)
            com.odisha.handloom.entity.PlatformConfig config = platformConfigRepository.findById("DEFAULT")
                    .orElse(com.odisha.handloom.entity.PlatformConfig.createDefault());

            for (OrderItem item : savedOrder.getOrderItems()) {
                BigDecimal gross = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

                // Commission
                BigDecimal commission = gross.multiply(config.getCommissionPercentage());

                // GST on Commission
                BigDecimal gst = commission.multiply(config.getGstPercentage());

                // Net Amount
                BigDecimal net = gross.subtract(commission).subtract(gst);

                SellerEarnings earnings = SellerEarnings.builder()
                        .seller(seller)
                        .order(savedOrder)
                        .orderItem(item)
                        .grossAmount(gross)
                        .commission(commission)
                        .gstAmount(gst)
                        .netAmount(net)
                        .payoutStatus(SellerEarnings.PayoutStatus.PENDING)
                        .build();

                sellerEarningsRepository.save(earnings);
            }

            // Notify Seller
            // Notify Seller
            notificationService.createNotification(seller,
                    "New order received from " + customer.getFullName(),
                    Notification.NotificationType.ORDER,
                    customer,
                    savedOrder.getId(),
                    null,
                    null);

            // Notify Admin
            adminNotificationService.notifyOrderCreated(savedOrder.getId(), savedOrder.getTotalAmount().doubleValue());

            // Set Invoice Number
            String invoiceNumber = "INV-" + LocalDateTime.now().getYear() + "-"
                    + savedOrder.getId().toString().substring(0, 6).toUpperCase();
            savedOrder.setInvoiceNumber(invoiceNumber);
            savedOrder.setInvoiceSent(true);
            savedOrder.setInvoiceSentAt(LocalDateTime.now());
            orderRepository.save(savedOrder);

            // Generate PDF
            byte[] invoicePdf = null;
            try {
                invoicePdf = invoiceService.generateInvoice(savedOrder);
            } catch (Exception e) {
                System.err.println(
                        "❌ Failed to generate invoice for order " + savedOrder.getId() + ": " + e.getMessage());
            }

            // Send Order Confirmation Email to Customer (with Invoice)
            emailService.sendOrderConfirmationEmail(
                    customer.getEmail(),
                    customer.getFullName(),
                    savedOrder.getId().toString().substring(0, 8),
                    savedOrder.getTotalAmount().doubleValue(),
                    savedOrder.getOrderItems(),
                    invoicePdf);

            // Send New Order Email to Seller
            try {
                emailService.sendNewOrderReceivedEmail(
                        seller.getEmail(),
                        seller.getShopName() != null ? seller.getShopName() : seller.getFullName(),
                        savedOrder.getId().toString().substring(0, 8),
                        customer.getFullName());
            } catch (Exception e) {
                System.err.println("[OrderService] Failed to send email to seller: " + e.getMessage());
            }
        }

        // Update customer address if not present
        if (address != null && !address.trim().isEmpty()) {
            if (customer.getAddress() == null || customer.getAddress().trim().isEmpty()) {
                customer.setAddress(address);
                userRepository.save(customer);
                System.out.println("[OrderService] Updated customer address from order.");
            }
        }

        return createdOrders;
    }

    public Order updateStatus(UUID orderId, OrderStatus status, String courier, String tracking) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (status == OrderStatus.OUT_FOR_DELIVERY && !order.isInvoiceSent()) {
            throw new RuntimeException("Invoice must be sent before delivery");
        }

        order.setStatus(status);
        if (courier != null)
            order.setCourierName(courier);
        if (tracking != null)
            order.setTrackingId(tracking);

        Order savedOrder = orderRepository.save(order);

        // Notify Customer
        notificationService.createNotification(savedOrder.getUser(), "Order Status Updated",
                "Your order #" + savedOrder.getId().toString().substring(0, 8) + " is now " + status);

        return savedOrder;
    }

    public void requestReturn(UUID orderId, UUID userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to return this order");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Only delivered orders can be returned");
        }

        order.setStatus(OrderStatus.RETURN_REQUESTED);
        orderRepository.save(order);

        // Send Return Request Email
        String productNames = order.getOrderItems().stream()
                .map(item -> item.getProduct().getName())
                .collect(Collectors.joining(", "));

        emailService.sendReturnRequestSubmittedEmail(
                order.getUser().getEmail(),
                order.getUser().getFullName(),
                order.getId().toString().substring(0, 8),
                productNames);
    }

    public void requestReplacement(UUID orderId, UUID userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to replace this order");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Only delivered orders can be replaced");
        }

        order.setStatus(OrderStatus.REPLACEMENT_REQUESTED);
        orderRepository.save(order);

        // Send Replacement Request Email
        String productNames = order.getOrderItems().stream()
                .map(item -> item.getProduct().getName())
                .collect(Collectors.joining(", "));

        emailService.sendReplacementRequestSubmittedEmail(
                order.getUser().getEmail(),
                order.getUser().getFullName(),
                order.getId().toString().substring(0, 8),
                productNames);
    }

    public void cancelOrder(UUID orderId, UUID userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Validate Owner
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to cancel this order");
        }

        // Validate Status
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.OUT_FOR_DELIVERY) {
            throw new RuntimeException("Order cannot be cancelled after shipping/delivery. Please request a return.");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        // Notify Seller
        notificationService.createNotification(order.getSeller(), "Order Cancelled",
                "Order #" + order.getId().toString().substring(0, 8) + " has been cancelled by the customer.");

        // TODO: Trigger Refund if PaymentMethod is PREPAID
    }

    public List<Order> getCustomerOrders(UUID userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getSellerOrders(UUID sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    public Order getOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // --- Populate Transient Fields for Frontend UI ---
        // Mock Logic to match user requirement "Price Details Card" demo
        // In real app, these would come from DB columns or detailed OrderMeta table

        BigDecimal total = order.getTotalAmount();

        // 1. Listing Price (e.g. 25% higher than selling price)
        order.setListingPrice(total.multiply(new BigDecimal("1.25")).setScale(0, java.math.RoundingMode.UP));

        // 2. Special Price (The actual selling price)
        order.setSpecialPrice(total);

        // 3. Fees (e.g. Platform fee)
        order.setTotalFees(new BigDecimal("29"));

        // 4. Other Discount (Matches fee to cancel it out or extra coupon)
        order.setOtherDiscount(new BigDecimal("29"));

        // 5. Coins Used (Mock)
        order.setCoinsUsed(new BigDecimal("6"));

        // 6. Payment Method Formatted
        String method = order.getPaymentMethod();
        if ("COD".equalsIgnoreCase(method)) {
            order.setFormattedPaymentMethod("Cash on Delivery");
        } else {
            order.setFormattedPaymentMethod("UPI, SuperCoins"); // Mocking "UPI, SuperCoins" as per requirement
        }

        // 7. Invoice Available (Mocking: Always available if not cancelled)
        order.setInvoiceAvailable(order.getStatus() != null && !order.getStatus().name().equals("CANCELLED"));

        return order;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    private static class TempItem {
        Product product;
        int quantity;

        public TempItem(Product product, int quantity) {
            this.product = product;
            this.quantity = quantity;
        }
    }
}
