# Python代码运行时间计时工具 - 高级使用指南

本指南将帮助您配置和使用Python代码运行时间计时工具的高级功能，让您可以在任何位置轻松测量Python代码的运行时间。

## 一、将计时工具添加到系统PATH

通过运行`add_timer_to_path.bat`，您可以将`universal_timer.py`所在目录添加到系统PATH中，这样就可以在任何命令行窗口中直接使用该工具。

### 操作步骤：

1. 找到并右键点击`add_timer_to_path.bat`文件
2. 选择"以管理员身份运行"
3. 等待脚本执行完成
4. **重要**：关闭所有打开的命令提示符和PowerShell窗口，然后重新打开它们以使更改生效

### 验证方法：

在新打开的命令提示符或PowerShell中，输入以下命令并按回车：

```
where universal_timer.py
```

如果能显示文件路径，则表示配置成功。

## 二、使用批处理快捷方式

`run_python_with_time.bat`是一个便捷的批处理快捷方式，让您可以更方便地使用计时工具。

### 使用方法：

1. 在命令行中导航到包含您的Python文件的目录
2. 运行以下命令：
   
   ```
   路径\to\run_python_with_time.bat your_file.py [additional_args]
   ```

   例如：
   ```
   C:\Users\wyx33\Desktop\Demo2\run_python_with_time.bat test_timer.py
   ```

### 功能特点：

- 自动查找`universal_timer.py`文件（优先在同一目录，其次在系统PATH中）
- 保留原始Python文件的参数传递功能
- 自动显示详细的运行时间信息
- 执行完成后保持窗口打开，便于查看结果

## 三、创建桌面快捷方式

为了更便捷地访问，可以创建`run_python_with_time.bat`的桌面快捷方式。

### 创建步骤：

1. 找到`run_python_with_time.bat`文件
2. 右键点击该文件，选择"发送到" > "桌面(创建快捷方式)"
3. 找到桌面上新创建的快捷方式，右键点击，选择"属性"
4. 在"快捷方式"选项卡中，您可以：
   - 修改"快捷方式名称"为您喜欢的名字，例如"Python代码计时工具"
   - 在"目标"字段的末尾添加一个空格和`%1`，使快捷方式可以接受拖放的文件
   - 点击"高级"按钮，勾选"以管理员身份运行"（如果需要）
   - 点击"确定"保存更改

### 使用桌面快捷方式：

1. 直接双击快捷方式 - 显示帮助信息
2. 将Python文件拖放到快捷方式上 - 自动运行该文件并显示运行时间
3. 创建多个快捷方式，分别用于不同的Python项目或环境

## 四、其他高级用法

### 1. 在VS Code中集成

您可以在VS Code中配置任务，使用我们提供的计时工具：

1. 打开`.vscode/tasks.json`文件
2. 添加或修改任务配置

### 2. 自定义输出格式

如果您需要自定义运行时间的显示格式，可以修改`universal_timer.py`文件中的相关代码，特别是以下部分：

```python
print(f"=== 运行结束: {file_path} ({end_time_str}) ===")
print(f"=== 运行时间: {execution_time:.6f} 秒 ({execution_time*1000:.2f} 毫秒) ===")
```

### 3. 批量计时多个文件

您可以创建一个批处理文件，使用我们的工具批量计时多个Python文件：

```batch
@echo off
REM 批量计时多个Python文件
for %%f in (*.py) do (
    echo 正在计时: %%f
    python universal_timer.py %%f
    echo. >> timing_results.txt
    echo 文件: %%f >> timing_results.txt
    echo 运行时间: 请从输出中复制 >> timing_results.txt
)
echo 所有文件计时完成，结果已保存到 timing_results.txt
pause
```

## 故障排除

如果遇到任何问题，请尝试以下解决方法：

1. 确保Python已正确安装并添加到系统PATH中
2. 检查`universal_timer.py`文件是否存在
3. 确认已重新启动命令提示符或PowerShell窗口以应用PATH更改
4. 以管理员身份运行批处理文件

如果问题依然存在，请检查错误信息并根据提示进行修复。

---

现在您已经掌握了Python代码运行时间计时工具的全部高级用法，可以在任何项目中方便地测量代码性能了！