@echo off
setlocal
set PGPASSWORD=Aditya

echo ==========================================
echo Auto-Creating Databases for Udrakala
echo User: postgres
echo Pass: Aditya
echo ==========================================

REM Attempt 1: Default PATH
echo [Attempt 1] Trying 'psql' from system PATH...
psql -U postgres -h 127.0.0.1 -f create_databases.sql
if %errorlevel% equ 0 goto success

REM Attempt 2: Common Locations
echo.
echo 'psql' not found in PATH or failed. Checking common install locations...

for %%v in (17,16,15,14,13,12) do (
    if exist "C:\Program Files\PostgreSQL\%%v\bin\psql.exe" (
        echo [Attempt] Found PostgreSQL %%v. Executing...
        "C:\Program Files\PostgreSQL\%%v\bin\psql.exe" -U postgres -h 127.0.0.1 -f create_databases.sql
        if %errorlevel% equ 0 goto success
    )
)

echo.
echo ==========================================
echo [ERROR] Could not find 'psql.exe' or failed to connect.
echo Please ensure Docker Desktop or PostgreSQL Service is RUNNING.
echo If running manually, execute the 'create_databases.sql' file.
echo ==========================================
pause
exit /b 1

:success
echo.
echo ==========================================
echo [SUCCESS] Databases created successfully!
echo ==========================================
pause
exit /b 0
