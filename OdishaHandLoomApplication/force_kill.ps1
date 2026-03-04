Stop-Process -Id 41020 -Force
Netstat -ano | Select-String ":8086" | Out-File -FilePath final_check_4.txt
