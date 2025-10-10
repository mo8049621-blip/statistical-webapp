@echo off
REM 直接使用Node.js路径启动服务器的脚本

REM 设置Node.js的完整路径
set NODE_PATH="C:\Program Files\nodejs"

REM 检查Node.js是否存在
echo 检查Node.js安装...
if not exist %NODE_PATH%\node.exe (
echo 错误：未找到Node.js安装在 %NODE_PATH%
echo 请检查您的Node.js安装路径
pause
exit /b 1
)
echo ✓ Node.js已找到

REM 检查npm是否存在
if not exist %NODE_PATH%\npm.cmd (
echo 警告：未找到npm
echo 正在尝试直接使用Node.js启动Vite...
echo.
)

REM 设置PATH环境变量
echo 设置环境变量...
set "PATH=%NODE_PATH%;%PATH%"

REM 显示版本信息
%NODE_PATH%\node.exe --version
if exist %NODE_PATH%\npm.cmd %NODE_PATH%\npm.cmd --version

echo.
echo 正在启动开发服务器...
echo 请在浏览器中访问 http://localhost:5173/

echo.
echo 启动命令：%NODE_PATH%\node.exe %NODE_PATH%\node_modules\npm\bin\npm-cli.js run dev

REM 直接使用Node.js执行npm命令
%NODE_PATH%\node.exe %NODE_PATH%\node_modules\npm\bin\npm-cli.js run dev

REM 如果上面的命令失败，尝试直接启动Vite
if %ERRORLEVEL% neq 0 (
echo.
echo 尝试直接启动Vite...
%NODE_PATH%\node.exe %NODE_PATH%\node_modules\vite\bin\vite.js
)

REM 防止窗口关闭
pause