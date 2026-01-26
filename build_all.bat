@echo off
echo Building all microservices...
mvn clean install -DskipTests
echo.
echo Build complete. Checks logs for any errors.
pause
