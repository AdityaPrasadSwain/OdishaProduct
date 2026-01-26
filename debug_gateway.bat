@echo off
echo Starting Service Registry...
cd OdishaHandLoomApplicationBackend\ServiceRegistry
start "Service Registry" cmd /k "..\..\..\Downloads\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run"

echo Waiting 20 seconds for Registry...
timeout /t 20

echo Starting API Gateway...
cd ..\ApiGateway
start "API Gateway Debug" cmd /k "..\..\..\Downloads\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run"
pause
