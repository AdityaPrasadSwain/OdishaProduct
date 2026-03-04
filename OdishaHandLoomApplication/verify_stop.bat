@echo off
netstat -ano | findstr :8086 > final_check.txt
