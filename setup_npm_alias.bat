@echo off

:: 设置npm命令的临时别名
echo 正在设置npm命令临时别名...
echo @echo off ^& "C:\Program Files\nodejs\npm.cmd" %%* > %temp%\npm.bat
echo @echo off ^& "C:\Program Files\nodejs\npx.cmd" %%* > %temp%\npx.bat

:: 将临时目录添加到当前会话的PATH
echo 正在配置临时环境变量...
set "PATH=%temp%;%PATH%"

echo 临时npm别名已设置成功！
echo 现在您可以直接使用npm和npx命令了。
echo 请在当前命令提示符窗口中运行：
echo npm -v
echo npx -v
echo 
echo 注意：此设置仅在当前命令提示符窗口有效，关闭窗口后需要重新运行此脚本。
echo 如果需要永久解决问题，请参考npm_fix_guide.md文件中的环境变量配置方法。
pause