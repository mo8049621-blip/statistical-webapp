@echo off

:: Check if Git is installed
where git >nul 2>nul
if %errorlevel% equ 0 (
    echo Git is installed!
    git --version
    pause
    call "%~dp0简化版部署到GitHub Pages.bat"
) else (
    echo Git is not installed!
    echo Please visit https://git-scm.com/downloads to download and install Git
    echo After installation, run this tool again
    pause
)