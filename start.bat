@echo off
title Loy Krathong 3D Server
echo ==================================================
echo   Starting Loy Krathong 3D Interactive Web App...
echo ==================================================
cd /d "%~dp0"
start http://localhost:3000/
npm.cmd run dev
pause
