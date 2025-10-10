@echo off
chcp 65001

title 一键完成网站压缩和部署

cls
echo =======================================================
echo              一键完成网站压缩和部署
echo =======================================================
echo.
echo 这个工具将自动完成两项任务：
echo 1. 压缩网站文件并保存到桌面（用于离线分享）
echo 2. 部署网站到GitHub Pages（用于在线访问）
echo.
echo 准备好后按任意键开始...
pause >nul

:compress_step
cls
echo =======================================================
echo                    第一步：压缩网站
echo =======================================================
echo.
echo 正在压缩网站文件，请稍候...

REM 定义项目名称和目标ZIP文件名
set PROJECT_NAME=综合数据分析平台
set ZIP_FILE_NAME=%PROJECT_NAME%_%date:~0,4%%date:~5,2%%date:~8,2%.zip
set SOURCE_DIR=%cd%

REM 确保压缩目标位于桌面
set TARGET_DIR=%USERPROFILE%\Desktop

REM 定义需要排除的文件和文件夹
set EXCLUDE_PATTERNS=",node_modules","dist",".git",".vscode","API key","charts",".env",".env.txt","*.py","*.xlsx","*.png"

REM 使用PowerShell进行压缩，排除指定文件和文件夹
powershell -Command "
    $source = '%SOURCE_DIR%';
    $target = '%TARGET_DIR%\%ZIP_FILE_NAME%';
    $exclude = %EXCLUDE_PATTERNS%;
    
    try {
        # 创建一个临时目录用于准备压缩内容
        $tempDir = Join-Path -Path $env:TEMP -ChildPath ('temp_' + (Get-Random).ToString());
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null;
        
        # 复制需要压缩的文件，排除不需要的文件
        Get-ChildItem -Path $source -Exclude $exclude | Copy-Item -Destination $tempDir -Recurse -Force;
        
        # 压缩文件夹
        Add-Type -AssemblyName System.IO.Compression.FileSystem;
        [System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $target);
        
        # 清理临时目录
        Remove-Item -Path $tempDir -Recurse -Force;
        
        Write-Host '✅ 压缩完成！';
        Write-Host '压缩文件已保存到：'$target;
    } catch {
        Write-Host '❌ 压缩过程中发生错误：'$_.Exception.Message -ForegroundColor Red;
    }
"
echo.
echo 按任意键继续部署到GitHub Pages...
pause >nul

:deploy_step
cls
echo =======================================================
echo                  第二步：部署到GitHub Pages
echo =======================================================
echo.
echo 请输入您的GitHub信息以继续部署：
echo.
set /p GITHUB_USERNAME=GitHub用户名：
echo.
set /p REPO_NAME=GitHub仓库名称：
echo.

REM 显示用户输入的信息进行确认
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
echo                配置Vite并安装依赖
echo =======================================================
echo.
echo 正在配置Vite以适应GitHub Pages...

REM 查找并修改vite.config.ts文件中的base配置
powershell -Command "
    $viteConfigPath = 'vite.config.ts';
    if (Test-Path $viteConfigPath) {
        $content = Get-Content $viteConfigPath;
        $newContent = $content -replace 'base:.*','base: ''/%REPO_NAME%/''';
        Set-Content $viteConfigPath $newContent;
        Write-Host '✅ Vite配置已成功更新！';
    } else {
        Write-Host '❌ 错误：未找到vite.config.ts文件。';
    }
" -args %REPO_NAME%
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
echo 按任意键继续构建和部署...
pause >nul

cls
echo =======================================================
echo                  构建并部署项目
echo =======================================================
echo.
echo 正在构建项目...
npm run build

if %errorlevel% neq 0 (
echo.
echo ❌ 错误：项目构建失败！
echo 按任意键退出...
pause >nul
exit /b %errorlevel%
)
echo.
echo ✅ 项目构建成功！
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
echo 请检查您的GitHub账号信息或网络连接。
echo 按任意键退出...
pause >nul
exit /b %errorlevel%
)

cls
echo =======================================================
echo                     任务完成！
echo =======================================================
echo.
echo ✅ 恭喜您！网站压缩和部署任务已成功完成！
echo.
echo 1. 压缩文件已保存到桌面：
echo    %TARGET_DIR%\%ZIP_FILE_NAME%
echo.
echo 2. 网站已部署到GitHub Pages！
echo 请在GitHub仓库设置中完成最后的配置：
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
echo 按任意键退出...
pause >nul

exit /b 0

:end
echo 操作已取消。
pause >nul
exit /b 0