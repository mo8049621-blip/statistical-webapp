@echo off
REM 简单的验证和使用计时工具的批处理文件

cls
echo ===================================================
echo        Python代码计时工具 - 验证和使用助手

echo ===================================================
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if %errorLevel% neq 0 (
    echo 错误: 未找到Python。请确保Python已正确安装并添加到系统PATH中。
    echo.
    echo 请访问 https://www.python.org/downloads/ 下载并安装Python。
    echo 安装时请勾选 "Add Python to PATH" 选项。
    echo.
    pause
    exit /B 1
) else (
    echo ✓ Python已安装: %PYTHON_VERSION%
)

REM 检查计时工具文件是否存在
if exist "%~dp0universal_timer.py" (
    echo ✓ 计时工具文件 found: %~dp0universal_timer.py
) else (
    echo 错误: 未找到计时工具文件 universal_timer.py。
    echo 请确保此文件与批处理文件在同一目录下。
    echo.
    pause
    exit /B 1
)

REM 显示使用菜单
:menu
cls
echo ===================================================
echo        Python代码计时工具 - 使用菜单

echo ===================================================
echo.
echo 1. 测试计时工具

echo 2. 运行指定的Python文件并计时

echo 3. 查看使用帮助

echo 4. 退出

echo.
set /p choice=请输入选项 (1-4): 

if "%choice%" == "1" goto test_timer
if "%choice%" == "2" goto run_file
if "%choice%" == "3" goto show_help
if "%choice%" == "4" exit /B 0

:invalid_choice
echo 无效的选项，请重试。

echo.
pause
goto menu

:test_timer
cls
echo 正在测试计时工具...

echo.
echo 创建临时测试文件...
echo print("计时工具测试成功！") > "%~dp0temp_test_timer.py"

echo 运行测试文件并计时...
echo.
python "%~dp0universal_timer.py" "%~dp0temp_test_timer.py"

echo.
del "%~dp0temp_test_timer.py" >nul 2>&1
echo 临时测试文件已删除。
echo.
pause
goto menu

:run_file
cls
set /p file_path=请输入Python文件的完整路径或名称: 

REM 检查文件是否存在
if not exist "%file_path%" (
    echo 错误: 找不到文件 "%file_path%"。
    echo 请检查文件路径是否正确。
    echo.
pause
goto menu
)

REM 检查文件是否为Python文件
set "ext=%~x1"
if /i not "%ext%" == ".py" (
    echo 警告: 指定的文件不是Python文件(.py)。
    echo 继续将尝试运行该文件，但可能会出现错误。
    echo.
    pause
)

cls
echo 正在运行文件: "%file_path%"

echo 并计时...
echo.
python "%~dp0universal_timer.py" "%file_path%"

echo.
pause
goto menu

:show_help
cls
echo ===================================================
echo               Python计时工具使用帮助

echo ===================================================
echo.
echo 计时工具可以帮助您测量Python代码的运行时间。
echo.
echo 使用方法1: 直接运行此批处理文件

echo   - 双击verify_and_use_timer.bat打开菜单

echo   - 选择相应选项进行操作

echo.
echo 使用方法2: 命令行运行

echo   在包含universal_timer.py的目录中，打开命令行窗口，输入:

echo   python universal_timer.py your_file.py

echo.
echo 注意事项:

echo   1. 确保Python已正确安装

echo   2. 确保universal_timer.py文件存在

echo   3. 对于复杂的Python程序，结果可能会有所不同

echo   4. 如果需要在任何目录使用，可以创建桌面快捷方式

echo.
pause
goto menu