@echo off
chcp 65001

echo ===============================
echo 综合数据分析平台 - 项目压缩工具
echo ===============================
echo 

REM 定义项目名称和目标ZIP文件名
set PROJECT_NAME=综合数据分析平台
set ZIP_FILE_NAME=%PROJECT_NAME%_%date:~0,4%%date:~5,2%%date:~8,2%.zip
set SOURCE_DIR=%cd%

REM 确保压缩目标位于桌面
set TARGET_DIR=%USERPROFILE%\Desktop

REM 定义需要排除的文件和文件夹
set EXCLUDE_PATTERNS=",node_modules","dist",".git",".vscode","API key","charts",".env",".env.txt","*.py","*.xlsx","*.png"

REM 使用PowerShell进行压缩，排除指定文件和文件夹
echo 正在压缩项目文件夹，请稍候...
powershell -Command "
    $source = '%SOURCE_DIR%';
    $target = '%TARGET_DIR%\%ZIP_FILE_NAME%';
    $exclude = %EXCLUDE_PATTERNS%;
    
    # 确保目标目录存在
    if(-not (Test-Path -Path $target)) {
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
            
            Write-Host '压缩完成！';
            Write-Host '压缩文件已保存到：'$target;
        } catch {
            Write-Host '压缩过程中发生错误：'$_.Exception.Message -ForegroundColor Red;
        }
    } else {
        Write-Host '目标压缩文件已存在，请先删除或重命名现有文件后重试。' -ForegroundColor Yellow;
    }
"

echo 
echo ===============================
echo 操作提示：
echo 1. 压缩文件已保存到桌面，文件名：%ZIP_FILE_NAME%
echo 2. 已自动排除不需要的文件（node_modules、dist等）
echo 3. 他人收到后，解压即可使用完整的网站代码
echo 4. 如需运行网站，解压后双击 start_dev_server.bat
echo ===============================

pause