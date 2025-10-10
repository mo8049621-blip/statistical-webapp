@echo off
REM 简单版开发服务器启动脚本

REM 清理Vite缓存
rmdir /s /q node_modules\.vite 2>nul

REM 使用指定端口启动开发服务器
npm run dev -- --port 5176

REM 防止窗口关闭
pause