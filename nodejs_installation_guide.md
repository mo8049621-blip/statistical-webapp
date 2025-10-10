# Node.js 安装指南与 React+TypeScript 项目创建

## 一、Node.js 安装步骤

### 1. 下载 Node.js

访问 Node.js 官方网站下载最新的长期支持(LTS)版本：
- 官方网站：[https://nodejs.org/zh-cn/](https://nodejs.org/zh-cn/) <mcreference link="https://nodejs.org/zh-cn/" index="2">2</mcreference>
- 下载页面：[https://nodejs.org/zh-cn/download/](https://nodejs.org/zh-cn/download/) <mcreference link="https://nodejs.org/zh-cn/download/" index="5">5</mcreference>

**推荐下载 LTS 版本**，因为它提供长期支持，更加稳定可靠。

### 2. 安装 Node.js

下载完成后，按照以下步骤安装：

1. 双击下载的安装包（通常是 `.msi` 文件）
2. 在安装向导中点击 "Next" 按钮
3. 阅读并接受许可协议，点击 "Next"
4. 选择安装路径（可以使用默认路径或自定义），点击 "Next"
5. 选择安装组件（建议保持默认选项），点击 "Next"
6. 点击 "Install" 按钮开始安装
7. 等待安装完成，点击 "Finish" 按钮完成安装 <mcreference link="https://blog.csdn.net/weixin_47095836/article/details/128433721" index="3">3</mcreference>

### 3. 验证安装

安装完成后，打开命令提示符（CMD）或 PowerShell，运行以下命令验证安装是否成功：

```bash
node -v  # 查看 Node.js 版本
npm -v   # 查看 npm 版本
```

如果成功显示版本号，则说明安装成功。

## 二、创建 React+TypeScript 项目

Node.js 安装完成后，我们将使用 Vite 来创建 React+TypeScript 项目。Vite 是一个现代前端构建工具，提供了更快的开发体验。

### 1. 在当前目录初始化项目

打开命令提示符或 PowerShell，导航到您的项目目录（即 `c:\Users\wyx33\Desktop\Demo2`），然后运行以下命令：

```bash
npm create vite@latest . -- --template react-ts
```

这个命令的含义是：
- `npm create vite@latest`：使用最新版本的 Vite 创建项目
- `.`：在当前目录创建项目，而不是创建新目录
- `-- --template react-ts`：使用 React+TypeScript 模板

### 2. 安装依赖

项目创建完成后，运行以下命令安装项目依赖：

```bash
npm install
```

### 3. 启动开发服务器

依赖安装完成后，可以启动开发服务器来查看项目运行效果：

```bash
npm run dev
```

这将启动一个本地开发服务器，通常在 `http://localhost:5173/` 上运行。您可以在浏览器中访问这个地址查看项目。

## 三、项目结构说明

创建完成的 React+TypeScript 项目将包含以下主要文件和目录：

- `package.json`：项目配置和依赖管理文件
- `tsconfig.json`：TypeScript 配置文件
- `vite.config.ts`：Vite 构建配置文件
- `src/`：源代码目录
  - `main.tsx`：应用入口文件
  - `App.tsx`：主应用组件
  - `App.css`：主应用样式
  - `index.css`：全局样式
  - `assets/`：静态资源目录

## 四、开始开发您的概率分布统计应用

项目创建完成后，您可以开始开发用于学习概率分布的统计网页应用。以下是一些建议的功能模块：

1. **概率分布选择器**：让用户选择不同类型的概率分布（如正态分布、二项分布、泊松分布等）
2. **参数配置面板**：允许用户调整分布的参数（如均值、方差、概率等）
3. **可视化图表**：使用图表库（如 Chart.js、D3.js 或 Recharts）展示概率分布曲线
4. **统计计算**：提供分布的关键统计指标计算（如均值、方差、分位数等）
5. **交互式演示**：允许用户通过交互方式理解概率分布的特性

## 五、常用开发命令

- `npm install <package-name>`：安装额外的依赖包
- `npm run build`：构建生产版本的应用
- `npm run preview`：预览生产构建的应用
- `npm run lint`：运行代码检查

祝您开发顺利！如果在安装或创建项目过程中遇到任何问题，请随时告诉我。