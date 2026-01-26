@echo off
echo Starting Microservices with MEMORY OPTIMIZATIONS...

set MVN_CMD="c:\Users\swain\Downloads\apache-maven-3.9.11\bin\mvn.cmd"
REM JVM Arguments: 128MB Start, 350MB Max per service.
set MEM_ARGS=-Dspring-boot.run.jvmArguments="-Xms128m -Xmx350m"

echo Using Maven at: %MVN_CMD%
echo Memory Limits: %MEM_ARGS%

echo Starting Service Registry (Eureka)...
start "Service Registry" cmd /k "cd OdishaHandLoomApplicationBackend/ServiceRegistry && %MVN_CMD% spring-boot:run %MEM_ARGS%"

echo Waiting for Service Registry to initialize (25 seconds)...
timeout /t 25

echo Starting API Gateway...
start "API Gateway" cmd /k "cd OdishaHandLoomApplicationBackend/ApiGateway && %MVN_CMD% spring-boot:run %MEM_ARGS%"

echo Starting Identity Service...
start "Identity Service" cmd /k "cd OdishaHandLoomApplicationBackend/IdentityService && %MVN_CMD% spring-boot:run %MEM_ARGS%"

echo Starting Product Service...
start "Product Service" cmd /k "cd OdishaHandLoomApplicationBackend/ProductService && %MVN_CMD% spring-boot:run %MEM_ARGS%"

echo Starting Order Service...
start "Order Service" cmd /k "cd OdishaHandLoomApplicationBackend/OrderService && %MVN_CMD% spring-boot:run %MEM_ARGS%"

echo Starting Seller Service...
start "Seller Service" cmd /k "cd OdishaHandLoomApplicationBackend/SellerService && %MVN_CMD% spring-boot:run %MEM_ARGS%"

echo Starting Payment Service...
start "Payment Service" cmd /k "cd OdishaHandLoomApplicationBackend/PaymentService && %MVN_CMD% spring-boot:run %MEM_ARGS%"

echo Starting Logistics Service...
start "Logistics Service" cmd /k "cd OdishaHandLoomApplicationBackend/LogisticsService && %MVN_CMD% spring-boot:run %MEM_ARGS%"

echo Starting Notification Service...
start "Notification Service" cmd /k "cd OdishaHandLoomApplicationBackend/NotificationService && %MVN_CMD% spring-boot:run %MEM_ARGS%"

echo All services dispatched with optimizations.
pause
