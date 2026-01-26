@echo off
echo Starting Application... > app.log
java -jar target/OdishaHandLoomApplication-0.0.1-SNAPSHOT.jar >> app.log 2>&1
