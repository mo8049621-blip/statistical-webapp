@echo off

:: 检查Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo 请先安装Git: https://git-scm.com/downloads
    pause
    exit /b 1
)

:: 检查Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 请先安装Node.js: https://nodejs.org
    pause
    exit /b 1
)

:: 配置GitHub信息
set /p GITHUB_USERNAME=GitHub用户名: 
set /p REPO_NAME=仓库名称: 

:: 更新vite.config.ts
echo 更新Vite配置...
powershell -Command "
    (Get-Content vite.config.ts) -replace 'base:.*','base: ''/$env:REPO_NAME/'' | Set-Content vite.config.ts
"

:: 安装依赖并构建
npm install
npm run build

:: 部署到GitHub Pages
npx gh-pages -d dist

if %errorlevel% equ 0 (
    echo 部署成功！访问: https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/
) else (
    echo 部署失败，请重试
)

pause