# 将Node.js添加到系统PATH环境变量的PowerShell脚本
# 注意：此脚本需要以管理员权限运行

Write-Host "正在将Node.js安装目录添加到系统PATH环境变量中..."

# 获取当前系统PATH环境变量
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")

# Node.js安装目录（根据之前的检查，Node.js安装在C:\Program Files\nodejs）
$nodeJsPath = "C:\Program Files\nodejs"

# 检查Node.js路径是否已经在PATH中
if ($currentPath -like "*$nodeJsPath*") {
    Write-Host "✓ Node.js路径已经存在于系统PATH环境变量中"
} else {
    # 将Node.js路径添加到PATH中
    $newPath = "$currentPath;$nodeJsPath"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
    Write-Host "✓ 成功将Node.js路径添加到系统PATH环境变量中"
    Write-Host "需要重启命令提示符或PowerShell窗口才能使更改生效"
}

# 显示当前PATH，供用户确认
Write-Host "\n当前系统PATH环境变量包含："
Write-Host $currentPath

Write-Host "\n脚本执行完成！请重启所有打开的命令提示符或PowerShell窗口。"

# 等待用户按任意键继续
Read-Host "按任意键退出..."