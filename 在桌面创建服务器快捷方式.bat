@echo off
chcp 65001

echo ===============================
echo 正在为开发服务器创建桌面快捷方式...

REM 设置项目路径和目标快捷方式路径
set PROJECT_DIR=%cd%
set TARGET_FILE=%PROJECT_DIR%\start_dev_server.bat
set DESKTOP_DIR=%USERPROFILE%\Desktop
set SHORTCUT_NAME=启动统计网站服务器.lnk

REM 使用PowerShell创建快捷方式
powershell -Command "
    $WshShell = New-Object -ComObject WScript.Shell;
    $Shortcut = $WshShell.CreateShortcut('%DESKTOP_DIR%\%SHORTCUT_NAME%');
    $Shortcut.TargetPath = '%TARGET_FILE%';
    $Shortcut.WorkingDirectory = '%PROJECT_DIR%';
    $Shortcut.Save();
    Write-Host '快捷方式已创建！';
"

echo 
echo ===============================
echo 操作已完成！
echo 您现在可以在桌面上找到一个名为 "启动统计网站服务器" 的快捷方式。
echo 双击这个快捷方式即可立即启动开发服务器。
echo ===============================

pause