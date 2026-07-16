@echo off
echo 🔥 Starting DiaCares Backend...
start /min python app.py
timeout /t 2
echo ✅ Backend jalan di http://localhost:5000
echo 🌐 Buka diacares.online untuk test
pause