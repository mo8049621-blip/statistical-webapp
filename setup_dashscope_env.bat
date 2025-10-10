@echo off
REM DashScope API环境变量设置工具
REM 此批处理文件将帮助您快速设置DASHSCOPE_API_KEY环境变量

REM 清空屏幕
cls

REM 显示标题
echo ===============================================================================
echo                  🚀 DashScope API 环境变量设置工具
echo ===============================================================================
echo.
echo 此工具将帮助您在Windows系统中设置DASHSCOPE_API_KEY环境变量

echo.
echo 🔔 请先访问 https://dashscope.console.aliyun.com/ 获取您的API密钥

echo.

REM 提示用户输入API密钥
set /p api_key=请输入您的DashScope API密钥: 

REM 检查用户是否输入了API密钥
if "%api_key%"=="" (
    echo.
    echo ❌ 错误：API密钥不能为空！
    echo 请重新运行此脚本并输入有效的API密钥
    echo.
    pause
    exit /b 1
)

REM 设置临时环境变量（当前会话有效）
set DASHSCOPE_API_KEY=%api_key%
echo.
echo ✅ 临时环境变量已设置完成（当前命令提示符会话有效）
echo 临时环境变量值: %DASHSCOPE_API_KEY%

REM 询问用户是否要设置永久环境变量
echo.
set /p set_permanent=是否要设置永久环境变量？(Y/N): 

if /i "%set_permanent%"=="Y" (
    REM 设置永久环境变量
    setx DASHSCOPE_API_KEY "%api_key%"
    
    if %errorlevel% equ 0 (
        echo.
        echo ✅ 永久环境变量设置成功！
        echo ℹ️  请注意：永久环境变量需要关闭当前命令提示符窗口并重新打开
        echo        才能在新的会话中生效
        echo.
    ) else (
        echo.
        echo ❌ 永久环境变量设置失败！
        echo ℹ️  您可能需要以管理员身份运行此脚本
        echo.
    )
) else (
    echo.
    echo ℹ️  已跳过永久环境变量设置
    echo 临时环境变量仅在当前命令提示符会话中有效
    echo.
)

REM 提供验证方法
echo ===============================================================================
echo 📝 验证方法:

echo 1. 在当前会话中验证：
echo    - 运行：echo %%DASHSCOPE_API_KEY%%
echo    - 如果显示了您的API密钥，则临时环境变量设置成功

echo.
echo 2. 在新会话中验证：
echo    - 关闭当前命令提示符窗口

echo    - 打开一个新的命令提示符窗口

echo    - 运行：echo %%DASHSCOPE_API_KEY%%
echo    - 如果显示了您的API密钥，则永久环境变量设置成功

echo.
echo 3. 运行测试脚本：
echo    - 导航到Demo2目录：cd c:\Users\wyx33\Desktop\Demo2
echo    - 运行：python dashscope_api_demo.py
echo ===============================================================================

echo.
pause