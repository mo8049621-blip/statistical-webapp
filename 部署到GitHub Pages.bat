@echo off

echo ===============================
echo GitHub Pages 部署工具
echo ===============================
echo.

echo 1. 正在构建应用...
npm run build

if %errorlevel% neq 0 (
echo.
echo 构建失败！请检查错误信息并修复问题后重试。
pause
exit /b %errorlevel%
)

echo.
echo 2. 正在部署到GitHub Pages...
npx gh-pages -d dist

if %errorlevel% neq 0 (
echo.
echo 部署失败！请检查错误信息并修复问题后重试。
echo 常见问题：请确保您已经正确设置了仓库名称（运行"设置GitHub仓库名称.bat"）
echo 并已登录GitHub（可以通过GitHub Desktop或命令行登录）。
pause
exit /b %errorlevel%
)

echo.
echo ✅ 部署成功！
echo.
echo 请在GitHub仓库设置中完成以下步骤：
echo 1. 打开GitHub仓库页面

echo 2. 点击"Settings"（设置）
echo 3. 向下滚动到"GitHub Pages"部分

echo 4. 在"Source"（来源）选项中，选择"gh-pages"分支和"/ (root)"目录

echo 5. 点击"Save"（保存）
echo.
echo 几分钟后，您的应用将在以下地址可用：
echo https://您的GitHub用户名.github.io/您的仓库名称/
echo.
echo 详细信息请参考 GITHUB_PAGES_DEPLOYMENT_CN.md 文件。
pause