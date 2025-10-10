# 如何运行 npm run dev 启动开发服务器

本文将详细介绍如何在Windows环境下运行`npm run dev`命令来启动开发服务器，以及常见问题的解决方案。

## 方法一：使用命令提示符(CMD)

这是最基本的方法，适合所有Windows用户：

### 步骤1：打开命令提示符

有三种方式可以打开命令提示符：

1. **通过开始菜单**：
   - 点击Windows开始菜单
   - 搜索"cmd"
   - 点击"命令提示符"应用程序

2. **通过运行对话框**：
   - 按下 `Win + R` 组合键
   - 输入 `cmd`
   - 点击"确定"按钮

3. **通过文件资源管理器**：
   - 打开文件资源管理器并导航到项目文件夹 `c:\Users\wyx33\Desktop\Demo2`
   - 在地址栏中输入 `cmd` 并按回车键

### 步骤2：导航到项目目录

如果您不是通过文件资源管理器打开的命令提示符，需要手动导航到项目目录：

```cmd
cd c:\Users\wyx33\Desktop\Demo2
```

输入上述命令后按回车键。如果路径中有空格，请使用引号包裹：

```cmd
cd "c:\Users\wyx33\Desktop\My Project"
```

### 步骤3：运行npm run dev命令

在项目目录下，输入以下命令并按回车键：

```cmd
npm run dev
```

### 步骤4：查看结果

如果一切正常，您会看到类似以下的输出：

```
> comprehensive-data-analysis-platform@0.0.0 dev
> vite

  VITE v4.4.9  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

这表示开发服务器已经成功启动，您可以在浏览器中访问 http://localhost:5173/ 来查看您的应用程序。

## 方法二：使用PowerShell

PowerShell是Windows系统中的高级命令行工具，功能更强大：

### 步骤1：打开PowerShell

1. 点击Windows开始菜单
2. 搜索"PowerShell"
3. 点击"Windows PowerShell"应用程序

### 步骤2：导航到项目目录

```powershell
cd c:\Users\wyx33\Desktop\Demo2
```

### 步骤3：运行npm run dev命令

```powershell
npm run dev
```

## 方法三：使用我们创建的批处理文件

为了方便您使用，我们已经创建了多个批处理文件来启动开发服务器：

### 方法3.1：使用配置AI_API.bat

1. 双击运行项目目录下的 `配置AI_API.bat` 文件
2. 按照提示完成配置
3. 当提示"按任意键启动开发服务器"时，按任意键即可启动

### 方法3.2：使用其他启动批处理文件

项目目录下还有多个专门用于启动开发服务器的批处理文件：

- `start_dev_server.bat`
- `start_dev_server_fixed.bat`
- `start_dev_server_improved.bat`
- `start_minimal.bat`
- `start_server_direct.bat`
- `start_server_english.bat`

您可以双击运行其中任意一个文件来启动开发服务器。

## 常见问题及解决方案

### 问题1：'npm' 不是内部或外部命令，也不是可运行的程序或批处理文件

**原因**：Node.js没有安装或者没有正确配置环境变量。

**解决方案**：
1. 检查Node.js是否已安装：在命令提示符中输入 `node --version`，如果显示版本号则表示已安装
2. 如果未安装，请下载并安装Node.js：https://nodejs.org/
3. 如果已安装但仍然出现此错误，需要配置环境变量

### 问题2：无法加载文件 ... 因为在此系统上禁止运行脚本

**原因**：PowerShell的执行策略限制了脚本的运行。

**解决方案**：
1. 以管理员身份运行PowerShell
2. 输入以下命令并按回车键：
   ```powershell
   Set-ExecutionPolicy RemoteSigned
   ```
3. 输入 `Y` 并按回车键确认

### 问题3：缺少依赖项错误

**原因**：项目依赖项没有安装。

**解决方案**：
在项目目录下运行以下命令安装依赖：

```cmd
npm install
```

### 问题4：端口被占用错误

**原因**：5173端口（Vite的默认端口）已经被其他程序占用。

**解决方案**：
1. 关闭占用该端口的程序
2. 或者在package.json文件中修改启动命令，指定其他端口：
   ```json
   "scripts": {
     "dev": "vite --port 5174"
   }
   ```

### 问题5：浏览器无法访问服务器

**原因**：可能是防火墙阻止了连接，或者服务器配置问题。

**解决方案**：
1. 检查防火墙设置，确保允许Node.js通过
2. 尝试在不同的浏览器中访问
3. 检查服务器输出的URL是否正确

## 如何停止开发服务器

当您完成开发工作后，可以通过以下方式停止开发服务器：

1. 在命令提示符或PowerShell窗口中，按下 `Ctrl + C` 组合键
2. 如果提示"终止批处理操作吗(Y/N)?"，输入 `Y` 并按回车键

## 额外提示

1. **开发服务器的优势**：开发服务器支持热重载，当您修改代码后，浏览器会自动刷新显示最新的更改

2. **查看控制台输出**：开发过程中的错误和警告会显示在命令提示符或PowerShell窗口中，请留意这些信息

3. **多终端运行**：您可以同时打开多个命令提示符窗口，一个用于运行开发服务器，另一个用于执行其他命令（如安装依赖、运行测试等）

如果您在运行开发服务器时遇到其他问题，请参考错误信息或查看项目中的日志文件，以便进一步排查问题。