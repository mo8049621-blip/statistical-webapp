@echo off
REM 一键开启调试模式批处理文件
REM 此脚本将自动修改 aiConfig.ts 文件中的 DEBUG_MODE 设置为 true

SETLOCAL ENABLEDELAYEDEXPANSION

REM 设置文件路径
SET "CONFIG_FILE=c:\Users\wyx33\Desktop\Demo2\src\config\aiConfig.ts"

REM 检查文件是否存在
IF NOT EXIST "%CONFIG_FILE%" (
    echo 错误：无法找到配置文件 %CONFIG_FILE%
    echo 请确认文件路径是否正确
    pause
    exit /b 1
)

REM 创建备份文件
COPY "%CONFIG_FILE%" "%CONFIG_FILE%.bak" >nul

REM 使用 PowerShell 修改文件内容
powershell -Command "(Get-Content '%CONFIG_FILE%') -replace 'DEBUG_MODE: false', 'DEBUG_MODE: true' | Set-Content '%CONFIG_FILE%'"

REM 检查修改是否成功
powershell -Command "$content = Get-Content '%CONFIG_FILE%'; if ($content -match 'DEBUG_MODE: true') { exit 0 } else { exit 1 }"

IF %ERRORLEVEL% EQU 0 (
    echo 调试模式已成功开启！
    echo 现在您可以在浏览器控制台查看详细日志。
    echo 请按 F12 打开开发者工具，切换到控制台标签页。
) ELSE (
    echo 警告：修改可能未成功，请手动检查文件。
    echo 尝试使用文本编辑器打开 %CONFIG_FILE%
    echo 查找并修改 DEBUG_MODE 设置为 true
)

REM 显示如何查看控制台日志的简单说明
echo.
echo ===== 如何查看控制台日志 =====
echo 1. 打开应用程序（http://localhost:5173/ 或 http://localhost:5174/）
echo 2. 按下 F12 键打开开发者工具
echo 3. 点击 "控制台" 标签页查看日志
echo 4. 使用AI数据生成功能时，将显示详细的调试信息
echo ===========================

echo.
echo 按任意键继续...
pause >nul

ENDLOCAL