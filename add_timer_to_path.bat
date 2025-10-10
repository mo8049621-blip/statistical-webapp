@echo off
REM Batch file to add universal_timer.py directory to system PATH with admin rights

REM Check for administrator privileges
NET SESSION >nul 2>&1
if %errorLevel% == 0 (
    echo 管理员权限已确认。正在运行脚本...
    powershell.exe -ExecutionPolicy Bypass -Command "$timerDir = Split-Path -Parent -Path '%~f0'; $currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User'); if($currentPath -notlike '*$timerDir*'){[Environment]::SetEnvironmentVariable('PATH', '$currentPath;$timerDir', 'User'); echo '计时脚本目录已添加到用户PATH中。'}; echo '您需要重新启动所有命令提示符和PowerShell窗口以使更改生效。'; pause"
) else (
    echo 需要管理员权限。
    echo 请求管理员权限...
    powershell.exe -Command "Start-Process '%~f0' -Verb RunAs"
    exit /B
)

pause