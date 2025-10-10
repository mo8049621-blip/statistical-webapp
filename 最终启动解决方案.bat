@echo off
REM 网站启动最终解决方案 - 确保窗口不会自动关闭

REM 清除屏幕，显示友好信息
cls
echo ======================================================
echo 欢迎使用数据分析平台开发服务器
 echo ======================================================
echo 正在启动开发服务器，请稍候...
echo.

REM 使用start命令在新窗口中启动开发服务器，并使用cmd /k确保窗口不会关闭
start cmd /k "echo 开发服务器启动中... && npm run dev"

REM 显示操作指南
echo 开发服务器已在新窗口中启动！
echo.
echo 请在浏览器中访问以下地址查看网站：
echo - 如果端口5173可用：http://localhost:5173/
echo - 如果端口5173被占用：http://localhost:5174/
echo (具体端口号请查看开发服务器窗口中的提示)
echo.
echo 如果遇到问题：
echo 1. 确保Node.js已正确安装
 echo 2. 尝试关闭其他占用端口的程序
 echo 3. 按Win+R，输入cmd，运行 "taskkill /f /im node.exe" 结束所有Node进程，然后重试
 echo.
echo 按任意键关闭此窗口...
pause >nul