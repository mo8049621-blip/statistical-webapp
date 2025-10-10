@echo off

:: 检查Git是否安装
where git >nul 2>nul
if %errorlevel% equ 0 (
    echo Git已安装！
    git --version
    pause
    call "%~dp0简化版部署到GitHub Pages.bat"
) else (
    echo 未检测到Git安装！
    echo 请访问 https://git-scm.com/downloads 下载安装Git
    echo 安装完成后重新运行此工具
    pause
)