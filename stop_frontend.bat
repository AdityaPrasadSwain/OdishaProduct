@echo off
echo Stopping all Node.js / Frontend processes...
taskkill /F /IM node.exe /T
echo.
echo If you saw "SUCCESS", the port 5173 is now free.
echo You can now run "start_all.bat" or "npm run dev".
pause
