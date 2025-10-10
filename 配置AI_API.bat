@echo off

REM AI API配置助手
REM 帮助用户快速完成AI API的配置

echo. 
echo =========== AI API配置助手 ===========
echo. 
echo 这个工具将帮助您配置DashScope API，使AI生成数据功能能够正常工作。
echo. 

REM 检查是否以管理员身份运行
NET SESSION >nul 2>&1
if %errorLevel% neq 0 (
echo 警告：请以管理员身份运行此脚本，以便能够修改环境变量。
echo.
)

REM 步骤1：备份当前的.env文件
if exist .env (
echo 步骤1：备份当前的.env文件...
copy .env .env.bak >nul
echo ✓ 已创建.env.bak备份文件
) else (
echo 步骤1：未找到.env文件，将直接创建新文件
echo.
)

REM 步骤2：使用修复后的.env文件
if exist .env.fixed (
echo 步骤2：使用修复后的.env文件...
copy .env.fixed .env >nul
echo ✓ 已更新.env文件
) else (
echo 步骤2：未找到.env.fixed文件
if not exist .env (
echo   创建默认的.env文件...
echo VITE_DASHSCOPE_API_KEY=请在此处输入您的API密钥 > .env
echo VITE_APP_TITLE=综合数据分析平台 >> .env
echo VITE_APP_VERSION=1.0.0 >> .env
echo VITE_API_TIMEOUT=30000 >> .env
echo VITE_DEBUG_MODE=false >> .env
echo ✓ 已创建默认的.env文件
)
echo.
)

REM 步骤3：安装依赖
if exist package.json (
echo 步骤3：安装项目依赖...
npm install >nul
echo ✓ 依赖安装完成
) else (
echo 步骤3：未找到package.json文件，跳过依赖安装
)
echo.

REM 步骤4：提示用户配置API密钥

echo 步骤4：请配置您的DashScope API密钥
echo ------------------------------------
echo 1. 访问 https://dashscope.console.aliyun.com/
echo 2. 登录您的阿里云账号
echo 3. 获取或生成新的API密钥
echo 4. 用记事本打开项目根目录的.env文件
echo 5. 将API密钥粘贴到VITE_DASHSCOPE_API_KEY=后面
echo ------------------------------------
echo.

REM 步骤5：启动开发服务器
:start_server
echo 步骤5：启动开发服务器
echo 按任意键启动开发服务器，或按ESC键退出...
choice /c any /n >nul
if errorlevel 3 (
echo 退出配置助手。
echo 请手动运行 npm run dev 来启动开发服务器。
echo.
echo 配置完成！请确保已在.env文件中设置正确的API密钥。
pause
exit /b
)

npm run dev
if errorlevel 1 (
echo 开发服务器启动失败，请检查错误信息并修复问题。
pause
exit /b
)

pause