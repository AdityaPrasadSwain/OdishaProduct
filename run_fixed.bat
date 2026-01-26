@echo off
echo Starting Microservices with FIXED Maven path...

set MVN_CMD="c:\Users\swain\Downloads\apache-maven-3.9.11\bin\mvn.cmd"

echo Using Maven at: %MVN_CMD%

echo Starting Service Registry (Eureka)...
start "Service Registry" cmd /k "cd OdishaHandLoomApplicationBackend/ServiceRegistry && %MVN_CMD% spring-boot:run"

echo Waiting for Service Registry to initialize (25 seconds)...
timeout /t 25

echo Starting API Gateway...
start "API Gateway" cmd /k "cd OdishaHandLoomApplicationBackend/ApiGateway && %MVN_CMD% spring-boot:run"

echo Starting Identity Service...
start "Identity Service" cmd /k "cd OdishaHandLoomApplicationBackend/IdentityService && %MVN_CMD% spring-boot:run"

echo Starting Product Service...
start "Product Service" cmd /k "cd OdishaHandLoomApplicationBackend/ProductService && %MVN_CMD% spring-boot:run"

echo Starting Order Service...
start "Order Service" cmd /k "cd OdishaHandLoomApplicationBackend/OrderService && %MVN_CMD% spring-boot:run"

echo Starting Seller Service...
start "Seller Service" cmd /k "cd OdishaHandLoomApplicationBackend/SellerService && %MVN_CMD% spring-boot:run"

echo Starting Payment Service...
start "Payment Service" cmd /k "cd OdishaHandLoomApplicationBackend/PaymentService && %MVN_CMD% spring-boot:run"

echo Starting Logistics Service...
start "Logistics Service" cmd /k "cd OdishaHandLoomApplicationBackend/LogisticsService && %MVN_CMD% spring-boot:run"

echo Starting Notification Service...
start "Notification Service" cmd /k "cd OdishaHandLoomApplicationBackend/NotificationService && %MVN_CMD% spring-boot:run"

echo All services dispatched.
pause
