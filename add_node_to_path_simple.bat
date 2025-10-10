@echo off
REM Simple batch file to add Node.js to PATH with admin rights

REM Check for administrator privileges
NET SESSION >nul 2>&1
if %errorLevel% == 0 (
    echo Admin privileges confirmed. Running script...
    powershell.exe -ExecutionPolicy Bypass -Command "$nodePath='C:\Program Files\nodejs'; $currentPath=[Environment]::GetEnvironmentVariable('PATH', 'Machine'); if($currentPath -notlike '*$nodePath*'){[Environment]::SetEnvironmentVariable('PATH', '$currentPath;$nodePath', 'Machine'); echo 'Node.js path added to system PATH.'} else {echo 'Node.js path already in system PATH.'}; echo 'You need to restart all command prompts and PowerShell windows for changes to take effect.'; pause"  
) else (
    echo Administrator privileges required.
    echo Requesting admin rights...
    powershell.exe -Command "Start-Process '%~f0' -Verb RunAs"
    exit /B
)

pause