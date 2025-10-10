@echo off
REM 改进版开发服务器启动脚本 - 确保窗口不会自动关闭
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

REM 安装依赖（如果尚未安装）
echo 检查并安装依赖...
npm install
if %ERRORLEVEL% neq 0 (
echo 错误：安装依赖失败。
pause
exit /b 1
)

REM 启动开发服务器
:start_server
echo 正在启动开发服务器...
echo 服务器启动后，请访问 http://localhost:5173 查看网站

echo 启动命令: npm run dev
start /wait cmd /k "npm run dev && pause"

REM 如果服务器异常退出，显示错误信息并等待用户操作
if %ERRORLEVEL% neq 0 (
echo.
echo 错误：开发服务器异常退出。
echo 可能的原因：
echo 1. 端口5173被占用
 echo 2. 项目配置有问题
 echo 3. 依赖缺失
 echo.
echo 按任意键重试，或按Ctrl+C退出...
 pause
 goto start_server
)

REM 防止窗口自动关闭
pause