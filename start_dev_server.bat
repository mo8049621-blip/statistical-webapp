@echo off
REM 临时设置Node.js路径到PATH环境变量
set PATH=C:\Program Files\nodejs;%PATH%

REM 显示当前PATH，验证Node.js路径是否正确添加
echo 当前PATH环境变量包含Node.js: %PATH%

echo 正在启动开发服务器...
npm run dev

REM 防止窗口自动关闭
pause