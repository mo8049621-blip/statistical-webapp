@echo off
chcp 65001 >nul

:: 定义aiConfig.ts文件路径
set "CONFIG_FILE=c:\Users\wyx33\Desktop\Demo2\src\config\aiConfig.ts"

:: 检查文件是否存在
if not exist "%CONFIG_FILE%" (
echo 错误：找不到aiConfig.ts文件。
echo 请检查路径是否正确：%CONFIG_FILE%
pause
exit /b 1
)

:: 创建备份文件
echo 正在创建备份文件...
copy "%CONFIG_FILE%" "%CONFIG_FILE%.bak" >nul
if %errorlevel% neq 0 (
echo 错误：无法创建备份文件。
pause
exit /b 1
)

:: 修改DEBUG_MODE设置
echo 正在启用调试模式...
:: 使用PowerShell来替换文件中的文本
powershell -Command "(Get-Content -Path '%CONFIG_FILE%') -replace 'DEBUG_MODE: false', 'DEBUG_MODE: true' | Set-Content -Path '%CONFIG_FILE%'"
if %errorlevel% neq 0 (
echo 错误：无法修改aiConfig.ts文件。
echo 请手动打开文件并将DEBUG_MODE设置为true。
pause
exit /b 1
)

:: 验证修改是否成功
powershell -Command "$content = Get-Content -Path '%CONFIG_FILE%'; if ($content -match 'DEBUG_MODE: true') { exit 0 } else { exit 1 }"
if %errorlevel% neq 0 (
echo 警告：修改可能未成功应用。
echo 请手动检查aiConfig.ts文件中的DEBUG_MODE设置。
) else (
echo 调试模式已成功开启！
)

echo.
echo ===========================================
echo 如何查看调试日志：
echo 1. 确保开发服务器正在运行（npm run dev）
echo 2. 在浏览器中打开应用程序（http://localhost:5173/或http://localhost:5174/）
echo 3. 按下F12键打开开发者工具
 echo 4. 切换到"控制台"标签页
echo 5. 尝试生成AI数据，查看详细日志
 echo ===========================================

echo.
echo 操作完成。按任意键继续...
pause >nul