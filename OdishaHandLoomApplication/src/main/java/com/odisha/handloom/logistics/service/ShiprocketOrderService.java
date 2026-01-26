package com.odisha.handloom.logistics.service;

import com.odisha.handloom.entity.Order;
import com.odisha.handloom.entity.OrderItem;
import com.odisha.handloom.logistics.config.ShiprocketConfig;
import com.odisha.handloom.logistics.dto.ShiprocketOrderItemDto;
import com.odisha.handloom.logistics.dto.ShiprocketOrderRequest;
import com.odisha.handloom.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShiprocketOrderService {

    private final ShiprocketAuthService authService;
    private final ShiprocketConfig shiprocketConfig;
    private final OrderRepository orderRepository;

    private RestClient getClient() {
        return RestClient.builder()
                .baseUrl(shiprocketConfig.getBaseUrl())
                .defaultHeader("Authorization", "Bearer " + authService.getAuthToken())
                .build();
    }

    // 1. Create Order
    public void createOrderInShiprocket(Order order) {
        try {
            log.info("Creating Shiprocket order for Order ID: {}", order.getId());
            ShiprocketOrderRequest request = mapOrderToRequest(order);

            Map<String, Object> response = getClient().post()
                    .uri("/orders/create/adhoc")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {
                    });

            if (response != null && response.containsKey("order_id")) {
                Integer shiprocketOrderId = (Integer) response.get("order_id");
                Integer shipmentId = (Integer) response.get("shipment_id");

                order.setShiprocketOrderId(String.valueOf(shiprocketOrderId));
                order.setShipmentId(String.valueOf(shipmentId));
                order.setStatus(com.odisha.handloom.entity.OrderStatus.SHIPPED);

                orderRepository.save(order);
                log.info("Shiprocket Order Created: {}", shiprocketOrderId);

                // Auto-assign courier after creation
                assignCourier(order, String.valueOf(shipmentId));

            } else {
                throw new RuntimeException("Shiprocket order creation failed: " + response);
            }
        } catch (Exception e) {
            log.error("Error creating Shiprocket order: {}", e.getMessage());
            throw new RuntimeException("Failed to create shipping order", e);
        }
    }

    // 2. Assign Courier & Generate AWB
    @SuppressWarnings("unchecked")
    public void assignCourier(Order order, String shipmentId) {
        try {
            log.info("Assigning courier for Shipment ID: {}", shipmentId);

            Integer bestCourierId = getBestCourier(order);

            Map<String, Object> request = Map.of(
                    "shipment_id", shipmentId,
                    "courier_id", bestCourierId != null ? bestCourierId : ""); // Handle null safe if needed

            Map<String, Object> response = getClient().post()
                    .uri("/courier/assign/awb")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {
                    });

            if (response != null) {
                Map<String, Object> responsePayload = (Map<String, Object>) response.get("response");
                if (responsePayload != null) {
                    Map<String, Object> data = (Map<String, Object>) responsePayload.get("data");

                    if (data != null && data.containsKey("awb_code")) {
                        String awb = (String) data.get("awb_code");
                        String courierName = (String) data.get("courier_name");

                        order.setAwbCode(awb);
                        order.setCourierName(courierName);
                        order.setTrackingId(awb);
                        orderRepository.save(order);
                        log.info("Courier Assigned: {} | AWB: {}", courierName, awb);
                    }
                }
            }

        } catch (Exception e) {
            log.error("Error assigning courier: {}", e.getMessage());
        }
    }

    // Helper to get Best Courier
    @SuppressWarnings("unchecked")
    private Integer getBestCourier(Order order) {
        try {
            String pickupPostcode = "751024"; // TODO: Configurable
            String deliveryPostcode = "751024"; // Placeholder
            String weight = "0.5";
            String cod = "0";

            String uri = String.format(
                    "/courier/serviceability?pickup_postcode=%s&delivery_postcode=%s&weight=%s&cod=%s",
                    pickupPostcode, deliveryPostcode, weight, cod);

            Map<String, Object> response = getClient().get()
                    .uri(uri)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {
                    });

            if (response != null) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                if (data != null && data.containsKey("available_courier_companies")) {
                    List<Map<String, Object>> couriers = (List<Map<String, Object>>) data
                            .get("available_courier_companies");
                    if (couriers != null && !couriers.isEmpty()) {
                        return (Integer) couriers.get(0).get("courier_company_id");
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch couriers, using default logic.");
        }
        return null;
    }

    // 3. Generate Label
    public String generateLabel(String shipmentId) {
        try {
            Map<String, Object> request = Map.of("shipment_id", List.of(shipmentId));

            Map<String, Object> response = getClient().post()
                    .uri("/courier/generate/label")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {
                    });

            if (response != null && response.containsKey("label_url")) {
                return (String) response.get("label_url");
            }
            return null;
        } catch (Exception e) {
            log.error("Error generating label: {}", e.getMessage());
            throw new RuntimeException("Failed to generate label", e);
        }
    }

    // 4. Track Shipment
    public Map<String, Object> trackShipment(String awb) {
        try {
            return getClient().get()
                    .uri("/courier/track/awb/" + awb)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {
                    });
        } catch (Exception e) {
            log.error("Error tracking shipment: {}", e.getMessage());
            throw new RuntimeException("Failed to track shipment", e);
        }
    }

    private ShiprocketOrderRequest mapOrderToRequest(Order order) {
        List<ShiprocketOrderItemDto> items = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                items.add(ShiprocketOrderItemDto.builder()
                        .name(item.getProduct().getName())
                        .sku(item.getProduct().getId().toString())
                        .units(item.getQuantity())
                        .selling_price(item.getPrice().doubleValue())
                        .discount(0)
                        .tax(0)
                        .build());
            }
        }

        String fullName = order.getUser() != null ? order.getUser().getFullName() : "Customer";
        String firstName = fullName;
        String lastName = "";
        if (fullName != null && fullName.contains(" ")) {
            String[] parts = fullName.split(" ", 2);
            firstName = parts[0];
            lastName = parts[1];
        }

        return ShiprocketOrderRequest.builder()
                .orderId(order.getId().toString())
                .orderDate(order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .pickupLocation("Primary")
                .billingCustomerName(firstName)
                .billingLastName(lastName)
                .billingAddress(order.getShippingAddress())
                .billingCity("Bhubaneswar")
                .billingPincode("751024")
                .billingState("Odisha")
                .billingCountry("India")
                .billingEmail(order.getUser() != null ? order.getUser().getEmail() : "customer@example.com")
                .billingPhone(order.getUser() != null ? order.getUser().getPhoneNumber() : "9999999999")
                .shippingIsBilling(true)
                .orderItems(items)
                .paymentMethod("Prepaid")
                .subTotal(order.getTotalAmount().doubleValue())
                .length(10)
                .breadth(10)
                .height(10)
                .weight(0.5)
                .build();
    }

    // 5. Handle Webhook
    public void updateOrderStatusFromWebhook(Map<String, Object> payload) {
        try {
            String awb = (String) payload.get("awb");
            String currentStatus = (String) payload.get("current_status");

            if (awb != null && currentStatus != null) {
                Order order = orderRepository.findByTrackingId(awb);
                if (order == null) {
                    log.warn("Order not found for AWB: {}", awb);
                    return;
                }

                log.info("Updating order status for AWB: {} to {}", awb, currentStatus);

                switch (currentStatus.toUpperCase()) {
                    case "DELIVERED":
                        order.setStatus(com.odisha.handloom.entity.OrderStatus.DELIVERED);
                        break;
                    case "CANCELED":
                        order.setStatus(com.odisha.handloom.entity.OrderStatus.CANCELLED);
                        break;
                    case "RTO INITIATED":
                    case "RTO DELIVERED":
                        order.setStatus(com.odisha.handloom.entity.OrderStatus.RETURNED);
                        break;
                    case "SHIPPED":
                        order.setStatus(com.odisha.handloom.entity.OrderStatus.SHIPPED);
                        break;
                    default:
                        log.info("Status '{}' not mapped to OrderStatus enum", currentStatus);
                }
                orderRepository.save(order);
            }
        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage());
        }
    }
}
