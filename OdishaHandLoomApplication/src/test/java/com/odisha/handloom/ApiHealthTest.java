package com.odisha.handloom;

import com.odisha.handloom.controller.CategoryController;
import com.odisha.handloom.controller.CustomerController;
import com.odisha.handloom.controller.SellerController;
import com.odisha.handloom.entity.Category;
import com.odisha.handloom.entity.Product;
import com.odisha.handloom.entity.Role;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.request.ProductRequest;
import com.odisha.handloom.repository.CategoryRepository;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class ApiHealthTest {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ApiHealthTest.class);

    @Autowired
    private CategoryController categoryController;

    @Autowired
    private SellerController sellerController;

    @Autowired
    private CustomerController customerController;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private com.odisha.handloom.repository.OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @org.springframework.test.context.bean.override.mockito.MockitoBean
    private com.odisha.handloom.service.CloudinaryService cloudinaryService;

    @Autowired
    private com.odisha.handloom.repository.ReturnRequestRepository returnRequestRepository;

    @Autowired
    private com.odisha.handloom.repository.OrderItemRepository orderItemRepository;

    @Autowired
    private com.odisha.handloom.repository.NotificationRepository notificationRepository;

    @Autowired
    private com.odisha.handloom.repository.AddressRepository addressRepository;

    @Autowired
    private com.odisha.handloom.repository.ProductImageRepository productImageRepository;

    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    @BeforeEach
    void setup() throws java.io.IOException {
        org.mockito.Mockito.when(cloudinaryService.uploadImage(org.mockito.ArgumentMatchers.any()))
                .thenReturn("http://mock-url.com/image.jpg");

        SecurityContextHolder.clearContext();

        try {
            entityManager.createNativeQuery("DELETE FROM return_requests").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM product_image_urls").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM wishlist_products").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM wishlists").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM reviews").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM cart_items").executeUpdate();
            entityManager.createNativeQuery("DELETE FROM carts").executeUpdate();
        } catch (Exception e) {
            System.out.println("Legacy/Extra table clean failed: " + e.getMessage());
        }

        returnRequestRepository.deleteAll();
        orderItemRepository.deleteAll();
        orderRepository.deleteAll();
        productImageRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        notificationRepository.deleteAll();
        addressRepository.deleteAll();
        userRepository.deleteAll();

        createTestUser("admin@test.com", "Admin User", Role.ADMIN);
        createTestUser("seller@test.com", "Seller User", Role.SELLER);
        createTestUser("customer@test.com", "Customer User", Role.CUSTOMER);
    }

    private void createTestUser(String email, String name, Role role) {
        User user = new User();
        user.setEmail(email);
        user.setFullName(name);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(role);
        if (role == Role.SELLER)
            user.setApproved(true);
        userRepository.save(user);
    }

    private void mockLogin(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                email,
                null,
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                        "ROLE_" + user.getRole().name())));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Autowired
    private com.odisha.handloom.controller.OrderController orderController;

    @Test
    public void testFullSystemFlow() {
        try {
            // 1. Admin Adds Category
            mockLogin("admin@test.com");

            Category category = new Category();
            category.setName("Handloom Sarees");
            category.setDescription("Authentic Odisha Handloom");

            ResponseEntity<Category> catResponse = categoryController.addCategory(category);
            assertEquals(200, catResponse.getStatusCode().value());
            assertNotNull(catResponse.getBody());

            UUID categoryId = catResponse.getBody().getId();
            System.out.println("STEP 1 SUCCESS: Category Added (ID: " + categoryId + ")");

            // 2. Seller Adds Product
            mockLogin("seller@test.com");

            ProductRequest product = new ProductRequest();
            product.setName("Sambalpuri Saree");
            product.setDescription("Fine Silk");
            product.setPrice(new BigDecimal("5000"));
            product.setStockQuantity(10);
            product.setCategoryId(categoryId);
            org.springframework.mock.web.MockMultipartFile image = new org.springframework.mock.web.MockMultipartFile(
                    "image", "saree.jpg", "image/jpeg", "dummy image content".getBytes());

            ResponseEntity<?> prodResponse = sellerController.addProduct(product, Collections.singletonList(image));
            assertEquals(200, prodResponse.getStatusCode().value());

            System.out.println("STEP 2 SUCCESS: Product Added by Seller");

            // Manually approve product
            Product savedProduct = productRepository.findByCategory_Id(categoryId).get(0);
            savedProduct.setApproved(true);
            productRepository.save(savedProduct);

            // 3. Customer Lists Products
            mockLogin("customer@test.com");

            List<Product> products = customerController.getAllProducts(null);
            assertFalse(products.isEmpty(), "Customer should see products");
            assertEquals("Sambalpuri Saree", products.get(0).getName());

            System.out.println("STEP 3 SUCCESS: Product Listed for Customer");

            // 4. Customer Places Order
            com.odisha.handloom.payload.request.OrderItemRequest itemRequest = new com.odisha.handloom.payload.request.OrderItemRequest();
            itemRequest.setProductId(savedProduct.getId());
            itemRequest.setQuantity(1);

            com.odisha.handloom.payload.request.OrderRequest orderRequest = new com.odisha.handloom.payload.request.OrderRequest();
            orderRequest.setItems(Collections.singletonList(itemRequest));
            orderRequest.setShippingAddress("Bhubaneswar, Odisha");
            orderRequest.setPaymentMethod("ONLINE");
            orderRequest.setPaymentId("PAY_123456789"); // Testing Payment ID

            ResponseEntity<?> orderResponse = orderController.placeOrder(orderRequest);
            assertEquals(200, orderResponse.getStatusCode().value());

            System.out.println("STEP 4 SUCCESS: Order Placed by Customer");

            // Verify Database
            List<com.odisha.handloom.entity.Order> orders = orderRepository.findAll();
            assertFalse(orders.isEmpty());
            assertEquals("PAY_123456789", orders.get(0).getPaymentId());
            System.out.println("VERIFICATION SUCCESS: Payment ID stored correctly.");

        } catch (Exception e) {
            System.out.println("EXCEPTION CAUGHT: " + e);
            e.printStackTrace();
            fail("Test failed with exception: " + e.getMessage());
        }
    }

    @Test
    public void testOrderRequestDeserialization() throws Exception {
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();

        // 1. Test Online Payment JSON
        String jsonOnline = "{\n" +
                "    \"items\": [],\n" +
                "    \"shippingAddress\": \"Test Address\",\n" +
                "    \"paymentMethod\": \"ONLINE\",\n" +
                "    \"paymentId\": \"pi_123456789\"\n" +
                "}";

        com.odisha.handloom.payload.request.OrderRequest reqOnline = mapper.readValue(jsonOnline,
                com.odisha.handloom.payload.request.OrderRequest.class);
        assertEquals("pi_123456789", reqOnline.getPaymentId());
        assertEquals("ONLINE", reqOnline.getPaymentMethod());
        System.out.println("VERIFICATION SUCCESS: JSON with 'paymentId' (Online) maps correctly.");

        // 2. Test COD Payment JSON
        String jsonCOD = "{\n" +
                "    \"items\": [],\n" +
                "    \"shippingAddress\": \"Test Address\",\n" +
                "    \"paymentMethod\": \"COD\",\n" +
                "    \"paymentId\": \"COD\"\n" +
                "}";

        com.odisha.handloom.payload.request.OrderRequest reqCOD = mapper.readValue(jsonCOD,
                com.odisha.handloom.payload.request.OrderRequest.class);
        assertEquals("COD", reqCOD.getPaymentId());
        System.out.println("VERIFICATION SUCCESS: JSON with 'paymentId' (COD) maps correctly.");
    }

    @Test
    public void testSellerOrderStatusWorkflow() {
        try {
            // Setup: Create Product
            mockLogin("admin@test.com");
            Category category = new Category();
            category.setName("TestCat");
            categoryController.addCategory(category);
            UUID categoryId = categoryRepository.findAll().get(0).getId();

            mockLogin("seller@test.com");
            ProductRequest p = new ProductRequest();
            p.setName("TestProd");
            p.setPrice(BigDecimal.valueOf(100));
            p.setStockQuantity(5);
            p.setCategoryId(categoryId);
            org.springframework.mock.web.MockMultipartFile img = new org.springframework.mock.web.MockMultipartFile(
                    "image", "x.jpg", "image/jpeg", "content".getBytes());
            sellerController.addProduct(p, Collections.singletonList(img));
            com.odisha.handloom.entity.Product prod = productRepository.findAll().get(0);
            prod.setApproved(true);
            productRepository.save(prod);

            // 1. Customer Places Order
            mockLogin("customer@test.com");
            com.odisha.handloom.payload.request.OrderItemRequest item = new com.odisha.handloom.payload.request.OrderItemRequest();
            item.setProductId(prod.getId());
            item.setQuantity(1);
            com.odisha.handloom.payload.request.OrderRequest req = new com.odisha.handloom.payload.request.OrderRequest();
            req.setItems(Collections.singletonList(item));
            req.setShippingAddress("Addr");
            req.setPaymentMethod("COD");
            req.setPaymentId("COD_123");
            orderController.placeOrder(req);

            UUID orderId = orderRepository.findAll().get(0).getId();

            // 2. Seller Fetches Orders
            mockLogin("seller@test.com");
            List<com.odisha.handloom.entity.Order> sellerOrders = orderController.getSellerOrders();
            assertFalse(sellerOrders.isEmpty());
            assertEquals(orderId, sellerOrders.get(0).getId());
            System.out.println("VERIFICATION SUCCESS: Seller fetched orders.");

            // 3. Seller Updates Status (Accept)
            com.odisha.handloom.controller.OrderController.StatusUpdateRequest updateReq = new com.odisha.handloom.controller.OrderController.StatusUpdateRequest();
            updateReq.setStatus(com.odisha.handloom.entity.OrderStatus.CONFIRMED);
            orderController.updateStatus(orderId, updateReq);

            com.odisha.handloom.entity.Order updatedOrder = orderRepository.findById(orderId).orElseThrow();
            assertEquals(com.odisha.handloom.entity.OrderStatus.CONFIRMED, updatedOrder.getStatus());
            System.out.println("VERIFICATION SUCCESS: Seller updated status to CONFIRMED.");

            // 4. Seller Ships Order
            updateReq.setStatus(com.odisha.handloom.entity.OrderStatus.SHIPPED);
            updateReq.setCourierName("BlueDart");
            updateReq.setTrackingId("TRK123");
            orderController.updateStatus(orderId, updateReq);

            updatedOrder = orderRepository.findById(orderId).orElseThrow();
            assertEquals(com.odisha.handloom.entity.OrderStatus.SHIPPED, updatedOrder.getStatus());
            assertEquals("BlueDart", updatedOrder.getCourierName());
            System.out.println("VERIFICATION SUCCESS: Seller shipped order with tracking.");

        } catch (Exception e) {
            e.printStackTrace();
            fail(e.getMessage());
        }
    }
}
