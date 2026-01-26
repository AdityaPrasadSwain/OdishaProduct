@echo off
echo Starting build... > build_output.txt
call mvn clean install -DskipTests >> build_output.txt 2>&1
echo Build finished with errorlevel %errorlevel% >> build_output.txt
