@echo off

REM 检查Git安装
where git >nul 2>nul
if %errorlevel% == 0 (
echo Git已安装
) else (
echo Git未安装，请从 https://git-scm.com/downloads 下载安装
pause
exit /b 1
)

REM 检查Node.js安装
where node >nul 2>nul
if %errorlevel% == 0 (
echo Node.js已安装
) else (
echo Node.js未安装，请从 https://nodejs.org 下载安装
pause
exit /b 1
)

REM 输入GitHub信息
set /p GITHUB_USERNAME=请输入GitHub用户名: 
set /p REPO_NAME=请输入GitHub仓库名称: 

REM 更新vite.config.ts
powershell -Command "$viteConfig='vite.config.ts';if(Test-Path $viteConfig){$content=Get-Content $viteConfig -Encoding UTF8;$newContent=$content -replace 'base:.*','base: ''/$env:REPO_NAME/''';Set-Content $viteConfig $newContent -Encoding UTF8;Write-Host 'Vite配置已更新'}"

REM 安装依赖
npm install
if %errorlevel% neq 0 (
echo 依赖安装失败
pause
exit /b 1
)

REM 构建项目
npm run build
if %errorlevel% neq 0 (
echo 项目构建失败
pause
exit /b 1
)

REM 部署到GitHub Pages
npx gh-pages -d dist
if %errorlevel% equ 0 (
echo 部署成功！请访问 https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/
) else (
echo 部署失败，请重试
)

pause