@echo off

echo ===============================
echo 综合数据分析平台 - 项目位置

echo 网站文件的主要位置:
echo 1. 项目根目录: %cd%
echo 2. 源代码目录: %cd%\src
echo 3. 组件目录: %cd%\src\components
echo 4. 构建输出目录: %cd%\dist (构建后生成)
echo.

echo 正在打开项目根目录...
start .
echo

echo 正在打开源代码目录...
start .\src

echo ===============================
echo 如需查看网站实际效果，请运行以下操作：
echo 1. 开发模式: 运行 "start_dev_server.bat"
echo 2. 部署到GitHub Pages: 运行 "部署到GitHub Pages.bat"
echo ===============================
echo.
pause