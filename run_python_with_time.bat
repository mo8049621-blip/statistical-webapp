@echo off
REM 快捷方式批处理文件 - 使用universal_timer.py运行Python文件并显示运行时间

REM 检查参数
if "%~1" == "" (
    echo 用法: run_python_with_time.bat your_file.py [additional_args]
    echo.
    echo 说明:
    echo 1. 此快捷方式用于方便地运行Python文件并显示其运行时间
    echo 2. 您可以将此批处理文件复制到任何位置使用
    echo 3. 您也可以创建此文件的桌面快捷方式，方便快速访问
    echo 4. 如果已经运行了add_timer_to_path.bat，您还可以在任何位置直接使用universal_timer.py
    echo.
    pause
    exit /B 1
)

REM 检查universal_timer.py是否存在于当前目录
if exist "%~dp0universal_timer.py" (
    REM 如果存在，直接使用当前目录的universal_timer.py
    python "%~dp0universal_timer.py" %*
) else (
    REM 否则尝试在PATH中查找universal_timer.py
    where universal_timer.py >nul 2>&1
    if %errorLevel% == 0 (
        REM 在PATH中找到，直接调用
        python -m universal_timer %*
    ) else (
        echo 错误: 找不到universal_timer.py文件。
        echo 请确保此文件与批处理文件在同一目录，或者已运行add_timer_to_path.bat将其所在目录添加到PATH中。
        pause
        exit /B 1
    )
)

REM 保持窗口打开以便查看结果
pause