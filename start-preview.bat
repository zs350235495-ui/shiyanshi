@echo off
chcp 65001 >nul
title 反重力网络架构与选型智库 - 本地预览

echo ========================================================
echo   反重力网络实验室 // ANTIGRAVITY NETWORK LABS
echo   正在启动 Astro + Tailwind 本地极速预览服务器...
echo ========================================================
echo.

start http://localhost:4321
npm.cmd run dev

pause
