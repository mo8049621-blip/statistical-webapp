@echo off
REM 清理缓存并启动开发服务器的脚本

REM 设置Node.js路径到PATH环境变量
set "PATH=C:\Program Files\nodejs;%PATH%"

REM 显示当前Node.js版本
node --version

REM 检查是否存在node_modules/.vite缓存目录，如果存在则删除
if exist "node_modules\.vite" (
    echo 清理Vite缓存...
    rmdir /s /q "node_modules\.vite"
    if %ERRORLEVEL% equ 0 (
        echo Vite缓存清理成功！
    ) else (
        echo 警告：清理缓存时遇到问题，但仍尝试启动服务器。
    )
)

REM 重新安装依赖（可选，取消注释下面一行来启用）
REM npm install

REM 启动开发服务器
cls
color 0A
echo.==============================================================================
echo.         已清理Vite缓存，现在启动开发服务器...
echo.         请等待服务器启动完成，然后在浏览器中访问显示的URL
REM 使用不同的端口启动，避免端口冲突
npm run dev -- --port 5175

REM 防止窗口自动关闭
pause