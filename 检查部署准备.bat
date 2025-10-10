@echo off

echo ===============================
echo GitHub Pages 部署准备检查
echo ===============================
echo.

REM 检查必要文件是否存在
echo 正在检查必要的部署文件...
set "all_files_exist=true"

if not exist "设置GitHub仓库名称.bat" (
echo ❌ 缺少文件: 设置GitHub仓库名称.bat
set "all_files_exist=false"
) else (
echo ✅ 找到: 设置GitHub仓库名称.bat
)

if not exist "部署到GitHub Pages.bat" (
echo ❌ 缺少文件: 部署到GitHub Pages.bat
set "all_files_exist=false"
) else (
echo ✅ 找到: 部署到GitHub Pages.bat
)

if not exist "GITHUB_PAGES_DEPLOYMENT_CN.md" (
echo ❌ 缺少文件: GITHUB_PAGES_DEPLOYMENT_CN.md
set "all_files_exist=false"
) else (
echo ✅ 找到: GITHUB_PAGES_DEPLOYMENT_CN.md
)

if not exist "DEPLOYMENT_README_CN.md" (
echo ❌ 缺少文件: DEPLOYMENT_README_CN.md
set "all_files_exist=false"
) else (
echo ✅ 找到: DEPLOYMENT_README_CN.md
)

if not exist "set_github_repo.js" (
echo ❌ 缺少文件: set_github_repo.js
set "all_files_exist=false"
) else (
echo ✅ 找到: set_github_repo.js
)

echo.

REM 检查package.json中的部署脚本
echo 正在检查package.json中的部署脚本...
findstr /C:"\"deploy\": \"npm run build && npx gh-pages -d dist\"" package.json >nul
if %errorlevel% equ 0 (
echo ✅ 已找到部署脚本
) else (
echo ❌ 未找到部署脚本，需要添加到package.json
set "all_files_exist=false"
)

echo.

REM 检查node_modules是否存在
echo 正在检查gh-pages是否安装...
if exist "node_modules\gh-pages" (
echo ✅ gh-pages已安装
) else (
echo ❌ gh-pages未安装，运行npm install --save-dev gh-pages进行安装
set "all_files_exist=false"
)

echo.

REM 输出检查结果
if %all_files_exist% equ true (
echo ===============================
echo ✅ 部署准备检查通过！
echo ===============================
echo 您可以按照以下步骤进行部署：
echo 1. 运行"设置GitHub仓库名称.bat"设置您的仓库名称

echo 2. 运行"部署到GitHub Pages.bat"进行部署

echo 3. 在GitHub仓库设置中配置GitHub Pages
) else (
echo ===============================
echo ❌ 部署准备检查未通过！
echo ===============================
echo 请修复上述问题后再进行部署。
)

echo.
pause