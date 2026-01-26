@echo off
echo Starting Odisha Handloom Full Stack Application...

echo [1/2] Launching Backend Services (Optimized)...
start cmd /k "call run_optimized.bat"

echo [2/2] Launching Frontend (UdraKala)...
cd UdraKala
start cmd /k "npm run dev"

echo.
echo ====================================================
echo Application Launch Initiated!
echo Backend: http://127.0.0.1:8761 (Eureka)
echo Frontend: http://localhost:5173
echo ====================================================
pause
