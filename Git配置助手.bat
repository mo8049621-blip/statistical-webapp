@echo off

REM Git配置助手 - 帮助您设置Git身份和认证方式

echo ========================
echo      Git配置助手

echo 注意：Git不需要像普通软件那样"登录"
echo 而是通过配置用户名/邮箱和认证方式来工作
echo ========================

REM 步骤1：设置Git用户名和邮箱
echo.
echo 步骤1：请设置您的Git用户名和邮箱
echo 这将显示在您的提交记录中
echo.

set /p GIT_USERNAME=请输入您的Git用户名（如GitHub用户名）: 
set /p GIT_EMAIL=请输入您的Git邮箱（如GitHub注册邮箱）: 

echo.
echo 正在配置Git用户名和邮箱...
git config --global user.name "%GIT_USERNAME%"
git config --global user.email "%GIT_EMAIL%"

echo 配置成功！
echo 当前Git配置:
git config --global --list
echo.

REM 步骤2：选择认证方式
echo ========================
echo 步骤2：选择Git认证方式
echo 1. SSH密钥（推荐 - 更安全，无需每次输入密码）
echo 2. HTTPS + 凭据管理器（简单 - 但可能需要定期输入令牌）
echo ========================

set /p AUTH_CHOICE=请选择认证方式（1或2）: 

echo.
if %AUTH_CHOICE% equ 1 (
echo 您选择了SSH密钥认证方式
echo ========================
echo 正在检查是否已存在SSH密钥...
if exist "%USERPROFILE%\.ssh\id_rsa.pub" (
echo 已发现SSH密钥，路径：%USERPROFILE%\.ssh\id_rsa.pub
echo 
echo 请将以下公钥内容复制到GitHub的SSH密钥设置中:
echo =========================================================
type "%USERPROFILE%\.ssh\id_rsa.pub"
echo =========================================================
echo 复制完成后，按任意键继续
pause
) else (
echo 未发现SSH密钥，正在生成新的SSH密钥...
echo 请按Enter键使用默认位置和空密码（推荐）
pause
git ssh-keygen -t rsa -b 4096 -C "%GIT_EMAIL%"
echo 
echo SSH密钥已生成！请将以下公钥内容复制到GitHub的SSH密钥设置中:
echo =========================================================
type "%USERPROFILE%\.ssh\id_rsa.pub"
echo =========================================================
echo 复制完成后，按任意键继续
pause
)
echo.
echo 请打开GitHub网站，按照以下步骤添加SSH密钥：
echo 1. 点击右上角头像 - Settings

echo 2. 在左侧菜单选择 - SSH and GPG keys

echo 3. 点击 - New SSH key

echo 4. 粘贴复制的公钥内容并保存

echo 添加完成后，Git将可以无密码访问您的GitHub仓库

echo.
echo 测试SSH连接...
git ssh -T git@github.com 2>nul
if %errorlevel% equ 0 (
echo SSH连接成功！
) else (
echo SSH连接测试失败，请检查公钥是否正确添加到GitHub
echo 或尝试手动运行：ssh -T git@github.com
)
) else if %AUTH_CHOICE% equ 2 (
echo 您选择了HTTPS + 凭据管理器认证方式
echo ========================
echo 正在配置Git凭据管理器...
git config --global credential.helper manager-core
echo 配置成功！
echo.
echo 使用方法：
echo 1. 当您第一次使用git push/pull等命令时
echo 2. Git会弹出窗口要求您输入GitHub用户名和个人访问令牌（不是密码）
echo 3. 输入后，凭据管理器会保存这些信息
echo 4. 后续操作将自动使用保存的凭据
echo.
echo 如何获取个人访问令牌？
echo 1. 登录GitHub，点击右上角头像 - Settings

echo 2. 在左侧菜单选择 - Developer settings

echo 3. 选择 - Personal access tokens - Tokens (classic)

echo 4. 点击 - Generate new token - Generate new token (classic)

echo 5. 输入名称，选择有效期，勾选所需权限（repo权限是必须的）

echo 6. 点击 - Generate token 并复制保存（令牌只会显示一次）
)

echo.
echo ========================
echo Git配置已完成！
echo 现在您可以使用Git命令或部署脚本来管理代码了
echo ========================
pause