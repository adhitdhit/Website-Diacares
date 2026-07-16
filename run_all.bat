@echo off
echo 🔥 STARTING DIACARES SYSTEM...
start cmd /k "cd server && python app.py"
timeout /t 3
start cmd /k "cd client && npm run dev"
echo ✅ SYSTEM READY! Buka http://localhost:5173
pause