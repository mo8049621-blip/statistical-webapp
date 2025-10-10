@echo off
REM 修复版开发服务器启动脚本
REM 设置Node.js路径到PATH环境变量
set "PATH=C:\Program Files\nodejs;%PATH%"

REM 显示当前Node.js版本，验证Node.js是否正确安装
node --version
if %ERRORLEVEL% neq 0 (
echo 错误：未找到Node.js。请确保已正确安装Node.js。
echo 可以运行"nodejs_installation_guide.md"文件查看安装指南。
pause
exit /b 1
)

REM 显示npm版本
npm --version
if %ERRORLEVEL% neq 0 (
echo 错误：未找到npm。请重新安装Node.js。
pause
exit /b 1
)

REM 启动开发服务器
echo 正在启动开发服务器...
npm run dev

REM 防止窗口自动关闭
pause