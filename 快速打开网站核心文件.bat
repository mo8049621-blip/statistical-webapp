@echo off

echo 正在打开项目根目录...
start .

echo 正在打开源代码目录...
start .\src

echo 正在打开组件目录...
start .\src\components

echo 正在打开主应用文件 App.tsx...
notepad .\src\App.tsx

echo 正在打开入口HTML文件 index.html...
notepad .\index.html

echo 所有核心文件和目录已打开！
echo 
echo ====================================================
echo 您可以查看和编辑这些文件来修改网站内容：
echo 1. App.tsx - 网站的主要结构和布局

echo 2. index.html - 网站的HTML入口文件

echo 3. src/components/ - 包含所有功能组件的文件夹

echo 4. 如需运行网站，请双击 "start_dev_server.bat"
echo ====================================================

pause