@echo off
setlocal enabledelayedexpansion

:: 配置控制台编码以支持中文
chcp 65001 >nul

:: 设置窗口标题
title GitHub Pages 部署工具 - 增强版

cls
:: 打印欢迎信息
echo ===============================================================================
echo                    GitHub Pages 部署工具 - 增强版

echo 此工具将帮助您将统计网站部署到GitHub Pages。
echo 请按照屏幕上的提示进行操作，窗口不会自动关闭。
echo ===============================================================================
echo.

:: 检查Git是否安装
echo 正在检查Git是否已安装...
where git >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ 检测到Git已安装！
    git --version
    echo.
) else (
    echo ❌ 未检测到Git安装！
    echo 请确认您已经正确安装了Git。
    echo 如果尚未安装，请访问 https://git-scm.com/downloads 下载并安装。
    echo 安装完成后请重新运行此工具。
    echo.
    echo 按任意键退出...
    pause >nul
    exit /b 1
)

:: 检查Node.js是否安装
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ 检测到Node.js已安装！
    node --version
    echo.
) else (
    echo ❌ 未检测到Node.js安装！
    echo 请确认您已经正确安装了Node.js。
    echo 如果尚未安装，请访问 https://nodejs.org/zh-cn/download/ 下载并安装。
    echo 安装完成后请重新运行此工具。
    echo.
    echo 按任意键退出...
    pause >nul
    exit /b 1
)

:: 提示用户输入GitHub信息
echo 请输入您的GitHub信息：
echo -----------------------
set /p GITHUB_USERNAME=请输入您的GitHub用户名：
if "!GITHUB_USERNAME!"=="" (
    echo 错误：用户名不能为空！
    echo 按任意键退出...
    pause >nul
    exit /b 1
)

set /p REPO_NAME=请输入您的GitHub仓库名称：
if "!REPO_NAME!"=="" (
    echo 错误：仓库名称不能为空！
    echo 按任意键退出...
    pause >nul
    exit /b 1
)

echo.
echo 您输入的信息如下：
echo GitHub用户名：!GITHUB_USERNAME!
echo 仓库名称：!REPO_NAME!
echo 完整仓库地址：https://github.com/!GITHUB_USERNAME!/!REPO_NAME!
echo.
echo 确认信息正确吗？（Y/N）
choice /c YN /n
if errorlevel 2 (
    echo 部署已取消。
    pause >nul
    exit /b 0
)

echo.
echo ===============================================================================
echo 正在配置Vite设置...
echo ===============================================================================

:: 配置vite.config.ts文件
powershell -Command "
    $viteConfigPath = 'vite.config.ts';
    if (Test-Path $viteConfigPath) {
        $content = Get-Content $viteConfigPath;
        $newContent = $content -replace 'base:.*','base: ''/!REPO_NAME!/''';
        Set-Content $viteConfigPath $newContent;
        Write-Host '✅ Vite配置已成功更新！';
    } else {
        Write-Host '❌ 错误：未找到vite.config.ts文件。';
        Write-Host '请确保您在正确的项目目录中。';
    }
" -args !REPO_NAME!

echo.
echo 按任意键继续...
pause >nul

echo.
echo ===============================================================================
echo 正在安装项目依赖...
echo ===============================================================================
echo 这可能需要一些时间，请耐心等待...
echo.

npm install
if %errorlevel% neq 0 (
    echo.
    echo ❌ 错误：依赖安装失败！
    echo 请检查您的网络连接或Node.js安装情况。
    echo 按任意键退出...
    pause >nul
    exit /b %errorlevel%
)

echo.
echo ✅ 依赖安装成功！
echo 按任意键继续...
pause >nul

echo.
echo ===============================================================================
echo 正在构建项目...
echo ===============================================================================
echo 这可能需要一些时间，请耐心等待...
echo.

npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ 错误：项目构建失败！
    echo 请检查错误信息并修复问题后重试。
    echo 常见问题：TypeScript编译错误、语法错误等。
    echo 按任意键退出...
    pause >nul
    exit /b %errorlevel%
)

echo.
echo ✅ 项目构建成功！
echo 按任意键继续...
pause >nul

echo.
echo ===============================================================================
echo 正在部署到GitHub Pages...
echo ===============================================================================
echo 重要提示：
echo 1. 这一步可能会提示您输入GitHub的用户名和密码/令牌
echo 2. 如果使用密码登录失败，请尝试使用个人访问令牌（PAT）
echo 3. 个人访问令牌需要有仓库的读写权限
echo.
echo 准备好后按任意键开始部署...
pause >nul
echo.

echo 正在执行部署命令...
npx gh-pages -d dist
if %errorlevel% neq 0 (
    echo.
    echo ❌ 错误：部署失败！
    echo 可能的原因：
    echo 1. GitHub用户名或密码/令牌错误
    echo 2. 仓库名称不正确
    echo 3. 网络连接问题
    echo 请检查上述问题后重试。
    echo 按任意键退出...
    pause >nul
    exit /b %errorlevel%
)

cls
echo ===============================================================================
echo                                部署成功！
echo ===============================================================================
echo.
echo ✅ 恭喜您！网站已成功部署到GitHub Pages！
echo.
echo 接下来，请在GitHub仓库设置中完成以下步骤：
echo 1. 打开您的GitHub仓库页面：https://github.com/!GITHUB_USERNAME!/!REPO_NAME!
echo 2. 点击顶部导航栏中的"Settings"（设置）
echo 3. 向下滚动到"GitHub Pages"部分
echo 4. 在"Source"（来源）选项中，选择"gh-pages"分支和"/ (root)"目录
echo 5. 点击"Save"（保存）
echo.
echo 几分钟后，您的网站将在以下地址可用：
echo https://!GITHUB_USERNAME!.github.io/!REPO_NAME!/
echo.
echo ===============================================================================
echo 部署过程已完成。按任意键退出...
pause >nul