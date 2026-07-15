@echo off
cd /d "%~dp0"
title DiaCARES - Starting Services

echo ========================================
echo   DiaCARES - Starting All Services
echo ========================================
echo.
echo [1/2] Starting Backend (Node.js)...
start "BACKEND" cmd /k "node server.js"

timeout /t 3 >nul

echo [2/2] Starting Frontend (Vite)...
start "FRONTEND" cmd /k "npm run dev"

timeout /t 5 >nul

echo.
echo [3/3] Starting Ngrok (Frontend Tunnel)...
if exist "ngrok.exe" (
    start "NGROK" cmd /k "ngrok.exe http 5173 --url https://angler-dawdler-aside.ngrok-free.dev"
) else (
    echo WARNING: ngrok.exe tidak ditemukan!
)

echo.
echo ========================================
echo   SETUP SELESAI!
echo   1. Localhost: http://localhost:5173
echo   2. Ngrok:     https://angler-dawdler-aside.ngrok-free.dev
echo   (Keduanya akan otomatis connect ke Backend!)
echo ========================================
pause