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

    @Autowired
    private com.odisha.handloom.service.ShipmentService shipmentService;

    @Autowired
    @org.springframework.context.annotation.Lazy
    private com.odisha.handloom.service.PaymentService paymentService;

    @Autowired
    private com.odisha.handloom.repository.CouponRepository couponRepository;

    @Autowired
    private com.odisha.handloom.repository.RefundRequestRepository refundRequestRepository;

    @Transactional
    public java.util.Map<String, Object> createOrder(User customer,
            com.odisha.handloom.payload.request.OrderRequest request) {
        String idempotencyKey = request.getIdempotencyKey();
        if (idempotencyKey != null && !idempotencyKey.isEmpty()) {
            List<Order> existingOrders = orderRepository.findByIdempotencyKey(idempotencyKey);
            if (!existingOrders.isEmpty()) {
                System.out.println("[OrderService] Idempotency key matched! Returning existing orders.");
                java.util.Map<String, Object> res = new java.util.HashMap<>();
                res.put("orders", existingOrders);
                return res;
            }
        }

        List<com.odisha.handloom.payload.request.OrderItemRequest> items = request.getItems();
        String address = request.getShippingAddress();
        String paymentMethod = request.getPaymentMethod();
        String paymentId = request.getPaymentId();
        UUID addressId = request.getAddressId();

        // Group items by Seller (Product -> Seller)
        List<TempItem> tempItems = new ArrayList<>();

        for (OrderItemRequest itemReq : items) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new com.odisha.handloom.exception.AppExceptions.ResourceNotFoundException("product: " + itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new com.odisha.handloom.exception.AppExceptions.InsufficientStockException(product.getName(), product.getStockQuantity());
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
            order.setIdempotencyKey(idempotencyKey);

            // Compute Shipping and Tax per order
            BigDecimal shippingCost = BigDecimal.valueOf(50); // Dummy flat fee for now
            BigDecimal taxAmount = BigDecimal.ZERO;
            order.setShippingCost(shippingCost);

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

            // Compute Tax (Dummy 5% GST)
            taxAmount = totalAmount.multiply(BigDecimal.valueOf(0.05));
            order.setTaxAmount(taxAmount);

            // Calculate Grand Total
            BigDecimal grandTotal = totalAmount.add(shippingCost).add(taxAmount);

            // Apply Coupon if exists
            if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
                com.odisha.handloom.entity.Coupon coupon = couponRepository.findByCode(request.getCouponCode())
                        .orElse(null);
                if (coupon != null && coupon.getIsActive() && coupon.getExpiryDate().isAfter(LocalDateTime.now())) {
                    if (grandTotal.compareTo(coupon.getMinOrderAmount()) >= 0) {
                        BigDecimal discount = BigDecimal.ZERO;
                        if (coupon.getDiscountType() == com.odisha.handloom.enums.DiscountType.PERCENTAGE) {
                            discount = grandTotal.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
                        } else {
                            discount = coupon.getDiscountValue();
                        }

                        if (coupon.getMaxDiscountAmount() != null
                                && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                            discount = coupon.getMaxDiscountAmount();
                        }
                        order.setDiscountAmount(discount);
                        grandTotal = grandTotal.subtract(discount);
                    }
                }
            }

            order.setTotalAmount(grandTotal);

            Order savedOrder = orderRepository.save(order);
            createdOrders.add(savedOrder);
            System.out.println("[OrderService] Order saved with ID: " + savedOrder.getId());

            // Initiate payment for this seller's order
            paymentService.initiatePayment(customer.getId(), savedOrder.getId(),
                    com.odisha.handloom.enums.PaymentMethod.valueOf(paymentMethod));

            if ("COD".equalsIgnoreCase(paymentMethod)) {
                processSuccessfulOrder(savedOrder);
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

        java.util.Map<String, Object> res = new java.util.HashMap<>();
        res.put("orders", createdOrders);
        return res;
    }

    @Transactional
    public void processSuccessfulOrder(Order savedOrder) {
        if (savedOrder == null)
            return;
        try {
            User seller = savedOrder.getSeller();
            User customer = savedOrder.getUser();

            // Auto-create Shipment
            // Auto-create Shipment
            shipmentService.createShipment(savedOrder.getId());

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

                SellerEarnings earnings = new SellerEarnings();
                earnings.setSeller(seller);
                earnings.setOrder(savedOrder);
                earnings.setOrderItem(item);
                earnings.setGrossAmount(gross);
                earnings.setCommission(commission);
                earnings.setGstAmount(gst);
                earnings.setNetAmount(net);
                earnings.setPayoutStatus(SellerEarnings.PayoutStatus.PENDING);

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
                    savedOrder.getUser().getEmail(),
                    savedOrder.getUser().getFullName(),
                    savedOrder.getId().toString().substring(0, 8),
                    savedOrder.getTotalAmount(),
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
        } catch (Exception ex) {
            System.err.println("[OrderService] processSuccessfulOrder error: " + ex.getMessage());
        }
    }

    public Order updateStatus(UUID orderId, OrderStatus status, String courier, String tracking) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new com.odisha.handloom.exception.AppExceptions.OrderNotFoundException());

        if (status == OrderStatus.OUT_FOR_DELIVERY && !order.isInvoiceSent()) {
            throw new com.odisha.handloom.exception.AppExceptions.OrderNotModifiableException("Invoiced status required");
        }

        order.setStatus(status);
        if (courier != null)
            order.setCourierName(courier);
        if (tracking != null)
            order.setTrackingId(tracking);

        // Auto-generate tracking ID if missing and status is READY_TO_SHIP or later
        if ((status == OrderStatus.READY_TO_SHIP || status == OrderStatus.SHIPPED || status == OrderStatus.DISPATCHED)
                && (order.getTrackingId() == null || order.getTrackingId().isEmpty())) {
            order.setTrackingId(
                    "TRK" + System.currentTimeMillis() + order.getId().toString().substring(0, 4).toUpperCase());
        }

        Order savedOrder = orderRepository.save(order);

        // Notify Customer
        notificationService.createNotification(savedOrder.getUser(), "Order Status Updated",
                "Your order #" + savedOrder.getId().toString().substring(0, 8) + " is now " + status);

        return savedOrder;
    }

    public void requestReturn(UUID orderId, UUID userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new com.odisha.handloom.exception.AppExceptions.OrderNotFoundException());

        if (!order.getUser().getId().equals(userId)) {
            throw new com.odisha.handloom.exception.AppExceptions.AccessDeniedException();
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new com.odisha.handloom.exception.AppExceptions.OrderNotModifiableException("Not delivered yet");
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
                .orElseThrow(() -> new com.odisha.handloom.exception.AppExceptions.OrderNotFoundException());

        if (!order.getUser().getId().equals(userId)) {
            throw new com.odisha.handloom.exception.AppExceptions.AccessDeniedException();
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new com.odisha.handloom.exception.AppExceptions.OrderNotModifiableException("Not delivered yet");
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

    @Transactional
    public void cancelOrderItems(UUID orderId, UUID customerId, List<UUID> itemIds) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new com.odisha.handloom.exception.AppExceptions.OrderNotFoundException());

        if (!order.getUser().getId().equals(customerId)) {
            throw new com.odisha.handloom.exception.AppExceptions.AccessDeniedException();
        }

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new com.odisha.handloom.exception.AppExceptions.OrderNotModifiableException(order.getStatus().toString());
        }

        BigDecimal refundAmount = BigDecimal.ZERO;

        for (UUID itemId : itemIds) {
            OrderItem itemToCancel = order.getOrderItems().stream()
                    .filter(item -> item.getId().equals(itemId))
                    .findFirst()
                    .orElseThrow(() -> new com.odisha.handloom.exception.AppExceptions.ResourceNotFoundException("order item"));

            // Restore Stock
            Product product = itemToCancel.getProduct();
            product.setStockQuantity(product.getStockQuantity() + itemToCancel.getQuantity());
            productRepository.save(product);

            // Create refund request for item
            BigDecimal itemTotal = itemToCancel.getPrice().multiply(BigDecimal.valueOf(itemToCancel.getQuantity()));
            refundAmount = refundAmount.add(itemTotal);

            com.odisha.handloom.entity.RefundRequest refundRequest = new com.odisha.handloom.entity.RefundRequest(
                    order, itemToCancel, order.getUser(), itemTotal, "User requested partial cancellation",
                    com.odisha.handloom.entity.RefundRequest.RefundStatus.REQUESTED);
            refundRequestRepository.save(refundRequest);

            // Remove item from order
            order.getOrderItems().remove(itemToCancel);
        }

        // Recalculate order total
        order.setTotalAmount(order.getTotalAmount().subtract(refundAmount));

        if (order.getOrderItems().isEmpty()) {
            order.setStatus(OrderStatus.CANCELLED);
        }

        orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(UUID orderId, UUID userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new com.odisha.handloom.exception.AppExceptions.OrderNotFoundException());

        // Validate Owner
        if (!order.getUser().getId().equals(userId)) {
            throw new com.odisha.handloom.exception.AppExceptions.AccessDeniedException();
        }

        // Validate Status
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.OUT_FOR_DELIVERY) {
            throw new com.odisha.handloom.exception.AppExceptions.OrderNotModifiableException("Shipped/Delivered");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new com.odisha.handloom.exception.AppExceptions.OrderNotModifiableException("Already Cancelled");
        }

        // Restore Stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            // Restore exact ordered quantity
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
            System.out.println("Restored stock for product: " + product.getName() + " | Qty: " + item.getQuantity());
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

    public List<Order> getFilteredCustomerOrders(UUID userId, OrderStatus status, String range,
            java.time.LocalDate from, java.time.LocalDate to) {
        LocalDateTime startDate = null;
        LocalDateTime endDate = null;
        LocalDateTime now = LocalDateTime.now();

        if (range != null) {
            switch (range.toUpperCase()) {
                case "DAY":
                    startDate = now.with(java.time.LocalTime.MIN);
                    endDate = now.with(java.time.LocalTime.MAX);
                    break;
                case "WEEK":
                    startDate = now.minusDays(7).with(java.time.LocalTime.MIN);
                    endDate = now.with(java.time.LocalTime.MAX);
                    break;
                case "MONTH":
                    startDate = now.minusDays(30).with(java.time.LocalTime.MIN);
                    endDate = now.with(java.time.LocalTime.MAX);
                    break;
                case "CUSTOM":
                    if (from != null)
                        startDate = from.atStartOfDay();
                    if (to != null)
                        endDate = to.atTime(java.time.LocalTime.MAX);
                    break;
                default:
                    // All Time
                    break;
            }
        }

        return orderRepository.findOrdersByFilters(userId, status, startDate, endDate);
    }

    public Order getOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new com.odisha.handloom.exception.AppExceptions.OrderNotFoundException());

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
