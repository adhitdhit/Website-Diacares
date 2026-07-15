@echo off
echo Stopping all services...
taskkill /F /IM node.exe
taskkill /F /IM ngrok.exe
echo Done!
pause