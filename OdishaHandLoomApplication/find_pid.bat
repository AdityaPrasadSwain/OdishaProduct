@echo off
netstat -ano | findstr :8086 > port_pid.txt
tasklist /FI "PID eq 41020" > pid_check.txt
