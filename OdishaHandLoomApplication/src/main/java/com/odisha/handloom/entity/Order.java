package com.odisha.handloom.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Customer

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller; // Seller (Added for multi-vendor support)

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<OrderItem> orderItems;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String shippingAddress;

    private String paymentMethod; // UPI, CARD, COD
    private String paymentId; // from Gateway

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Payment paymentDetails;

    private UUID addressId; // Link to saved address

    // Shipping Details
    private String courierName;
    private String trackingId;

    // Invoice Details
    @Column(name = "invoice_sent", nullable = false)
    private Boolean invoiceSent = false;
    private LocalDateTime invoiceSentAt;
    private String invoiceNumber;

    @Column(name = "discount_amount")
    private BigDecimal discountAmount = BigDecimal.ZERO;

    // Transient fields for Frontend UI (Not stored in DB)
    @Transient
    private BigDecimal listingPrice;

    @Transient
    private BigDecimal specialPrice;

    @Transient
    private BigDecimal totalFees;

    @Transient
    private BigDecimal otherDiscount;

    @Transient
    private BigDecimal coinsUsed;

    @Transient
    private String formattedPaymentMethod; // e.g. "UPI, SuperCoins"

    @Transient
    private Boolean invoiceAvailable;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Order() {
    }

    public Order(UUID id, User user, User seller, List<OrderItem> orderItems, BigDecimal totalAmount,
            OrderStatus status,
            String shippingAddress, String paymentMethod, String paymentId, String courierName, String trackingId,
            Boolean invoiceSent, LocalDateTime invoiceSentAt, String invoiceNumber,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.seller = seller;
        this.orderItems = orderItems;
        this.totalAmount = totalAmount;
        this.status = status;
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
        this.paymentId = paymentId;
        this.courierName = courierName;
        this.trackingId = trackingId;
        this.invoiceSent = invoiceSent;
        this.invoiceSentAt = invoiceSentAt;
        this.invoiceNumber = invoiceNumber;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static OrderBuilder builder() {
        return new OrderBuilder();
    }

    public static class OrderBuilder {
        private UUID id;
        private User user;
        private User seller;
        private List<OrderItem> orderItems;
        private BigDecimal totalAmount;
        private OrderStatus status;
        private String shippingAddress;
        private String paymentMethod;
        private String paymentId;
        private String courierName;
        private String trackingId;
        private Boolean invoiceSent;
        private LocalDateTime invoiceSentAt;
        private String invoiceNumber;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        OrderBuilder() {
        }

        public OrderBuilder id(UUID id) {
            this.id = id;
            return this;
        }

        public OrderBuilder user(User user) {
            this.user = user;
            return this;
        }

        public OrderBuilder seller(User seller) {
            this.seller = seller;
            return this;
        }

        public OrderBuilder orderItems(List<OrderItem> orderItems) {
            this.orderItems = orderItems;
            return this;
        }

        public OrderBuilder totalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public OrderBuilder status(OrderStatus status) {
            this.status = status;
            return this;
        }

        public OrderBuilder shippingAddress(String shippingAddress) {
            this.shippingAddress = shippingAddress;
            return this;
        }

        public OrderBuilder paymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }

        public OrderBuilder paymentId(String paymentId) {
            this.paymentId = paymentId;
            return this;
        }

        public OrderBuilder courierName(String courierName) {
            this.courierName = courierName;
            return this;
        }

        public OrderBuilder trackingId(String trackingId) {
            this.trackingId = trackingId;
            return this;
        }

        public OrderBuilder invoiceSent(Boolean invoiceSent) {
            this.invoiceSent = invoiceSent;
            return this;
        }

        public OrderBuilder invoiceSentAt(LocalDateTime invoiceSentAt) {
            this.invoiceSentAt = invoiceSentAt;
            return this;
        }

        public OrderBuilder invoiceNumber(String invoiceNumber) {
            this.invoiceNumber = invoiceNumber;
            return this;
        }

        public OrderBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public OrderBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Order build() {
            return new Order(id, user, seller, orderItems, totalAmount, status, shippingAddress, paymentMethod,
                    paymentId, courierName, trackingId, invoiceSent, invoiceSentAt, invoiceNumber,
                    createdAt, updatedAt);
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public UUID getAddressId() {
        return addressId;
    }

    public void setAddressId(UUID addressId) {
        this.addressId = addressId;
    }

    public String getCourierName() {
        return courierName;
    }

    public void setCourierName(String courierName) {
        this.courierName = courierName;
    }

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public boolean isInvoiceSent() {
        return Boolean.TRUE.equals(invoiceSent);
    }

    public void setInvoiceSent(Boolean invoiceSent) {
        this.invoiceSent = invoiceSent;
    }

    public LocalDateTime getInvoiceSentAt() {
        return invoiceSentAt;
    }

    public void setInvoiceSentAt(LocalDateTime invoiceSentAt) {
        this.invoiceSentAt = invoiceSentAt;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Getters and Setters for Transient Fields

    public BigDecimal getListingPrice() {
        return listingPrice;
    }

    public void setListingPrice(BigDecimal listingPrice) {
        this.listingPrice = listingPrice;
    }

    public BigDecimal getSpecialPrice() {
        return specialPrice;
    }

    public void setSpecialPrice(BigDecimal specialPrice) {
        this.specialPrice = specialPrice;
    }

    public BigDecimal getTotalFees() {
        return totalFees;
    }

    public void setTotalFees(BigDecimal totalFees) {
        this.totalFees = totalFees;
    }

    public BigDecimal getOtherDiscount() {
        return otherDiscount;
    }

    public void setOtherDiscount(BigDecimal otherDiscount) {
        this.otherDiscount = otherDiscount;
    }

    public BigDecimal getCoinsUsed() {
        return coinsUsed;
    }

    public void setCoinsUsed(BigDecimal coinsUsed) {
        this.coinsUsed = coinsUsed;
    }

    public String getFormattedPaymentMethod() {
        return formattedPaymentMethod;
    }

    public void setFormattedPaymentMethod(String formattedPaymentMethod) {
        this.formattedPaymentMethod = formattedPaymentMethod;
    }

    public boolean isInvoiceAvailable() {
        return Boolean.TRUE.equals(invoiceAvailable);
    }

    public void setInvoiceAvailable(Boolean invoiceAvailable) {
        this.invoiceAvailable = invoiceAvailable;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }
}
