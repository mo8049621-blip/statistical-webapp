@echo off

echo 正在检查Git安装情况...
where git >nul 2>nul
if %errorlevel% equ 0 (
    echo Git已安装
) else (
    echo Git未安装，请从 https://git-scm.com/downloads 下载安装
    pause
    exit /b 1
)

echo 正在检查Node.js安装情况...
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Node.js已安装
) else (
    echo Node.js未安装，请从 https://nodejs.org 下载安装
    pause
    exit /b 1
)

set /p GITHUB_USERNAME=请输入GitHub用户名: 
set /p REPO_NAME=请输入GitHub仓库名称: 

powershell -Command "
    $viteConfig = 'vite.config.ts';
    if (Test-Path $viteConfig) {
        $content = Get-Content $viteConfig -Encoding UTF8;
        $newContent = $content -replace 'base:.*','base: ''/$env:REPO_NAME/''';
        Set-Content $viteConfig $newContent -Encoding UTF8;
        Write-Host 'Vite配置已更新';
    }
" -args $REPO_NAME

npm install
npm run build
npx gh-pages -d dist

if %errorlevel% equ 0 (
    echo 部署成功！请访问 https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/
) else (
    echo 部署失败，请重试
)

pause