@echo off
chcp 65001

:: 设置批处理文件标题
title GitHub Pages 简化部署工具 - 初学者友好版

cls
echo =======================================================
echo            GitHub Pages 简化部署工具
 echo               （专为初学者设计）
echo =======================================================
echo.
echo 这个工具将帮助您轻松地将统计网站部署到GitHub Pages。
echo 无需了解复杂的Git命令，只需按照提示一步步操作即可。
echo.
echo 请确保您已经：
echo 1. 在GitHub官网注册了账号
 echo 2. 在电脑上安装了Git（如果没有，请先安装Git）
echo 3. 在GitHub上创建了一个新的仓库
echo.
echo 准备好后按任意键继续...
pause >nul

cls
echo =======================================================
echo                 第一步：设置仓库信息
echo =======================================================
echo.
set /p GITHUB_USERNAME=请输入您的GitHub用户名：
echo.
set /p REPO_NAME=请输入您的GitHub仓库名称：
echo.

:: 显示用户输入的信息进行确认
echo 您输入的信息如下：
echo GitHub用户名：%GITHUB_USERNAME%
echo 仓库名称：%REPO_NAME%
echo 完整仓库地址：https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.
echo 确认信息正确吗？（Y/N）
choice /c YN /n
if errorlevel 2 goto end

cls
echo =======================================================
echo                第二步：配置Vite设置
echo =======================================================
echo.
echo 正在配置Vite以适应GitHub Pages...

:: 查找并修改vite.config.ts文件中的base配置
powershell -Command "
    $viteConfigPath = 'vite.config.ts';
    if (Test-Path $viteConfigPath) {
        $content = Get-Content $viteConfigPath;
        $newContent = $content -replace 'base:.*','base: ''/%REPO_NAME%/''';
        Set-Content $viteConfigPath $newContent;
        Write-Host '✅ Vite配置已成功更新！';
    } else {
        Write-Host '❌ 错误：未找到vite.config.ts文件。';
        Write-Host '请确保您在正确的项目目录中。';
    }
" -args %REPO_NAME%
echo.
echo 按任意键继续...
pause >nul

cls
echo =======================================================
echo                第三步：安装依赖
 echo =======================================================
echo.
echo 正在安装项目依赖...
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

cls
echo =======================================================
echo                 第四步：构建项目
echo =======================================================
echo.
echo 正在构建项目（这可能需要一些时间）...
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

cls
echo =======================================================
echo                第五步：部署到GitHub Pages
echo =======================================================
echo.
echo 重要提示：
echo 1. 这一步可能会提示您输入GitHub的用户名和密码/令牌
echo 2. 如果使用密码登录失败，请尝试使用个人访问令牌（PAT）
echo 3. 个人访问令牌需要有仓库的读写权限
echo.
echo 准备好后按任意键开始部署...
pause >nul
echo.
echo 正在部署到GitHub Pages...
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
echo =======================================================
echo                     部署成功！
echo =======================================================
echo.
echo ✅ 恭喜您！网站已成功部署到GitHub Pages！
echo.
echo 接下来，请在GitHub仓库设置中完成以下步骤：
echo 1. 打开您的GitHub仓库页面：https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo 2. 点击顶部导航栏中的"Settings"（设置）
echo 3. 向下滚动到"GitHub Pages"部分
echo 4. 在"Source"（来源）选项中，选择"gh-pages"分支和"/ (root)"目录
echo 5. 点击"Save"（保存）
echo.
echo 几分钟后，您的网站将在以下地址可用：
echo https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/
echo.
echo =======================================================
echo                    部署完成！
echo =======================================================
echo.
echo 详细部署说明请参考：网站压缩与GitHub Pages部署指南.md
echo.
echo 按任意键退出...
pause >nul

:end
echo 部署已取消。
pause >nul