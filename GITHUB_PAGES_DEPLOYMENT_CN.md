# GitHub Pages 部署指南

本指南将详细介绍如何将您的统计网页应用部署到 GitHub Pages。作为 Git 和 GitHub 的初学者，您可以按照以下步骤逐步操作。

## 前提条件
- 您的代码已经上传到 GitHub 仓库
- 您的计算机上已安装 Node.js 和 npm

## 第 1 步：安装 gh-pages 包

首先，我们需要安装 `gh-pages` 包，这是一个简化 GitHub Pages 部署的工具：

打开命令行工具（在 Windows 上可以是 PowerShell 或命令提示符），进入项目目录，然后运行以下命令：

```bash
npm install --save-dev gh-pages
```

这个命令会将 gh-pages 作为开发依赖项安装到您的项目中。

## 第 2 步：配置 Vite 以适应 GitHub Pages

GitHub Pages 部署需要正确设置 base 路径，以确保您的应用能够正确加载资源。

打开 `vite.config.ts` 文件，修改 `base` 配置：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 基础路径配置
  // 如果您的仓库地址是 https://github.com/用户名/仓库名，则设置 base: '/仓库名/'
  base: '/您的仓库名称/',
})
```

例如，如果您的 GitHub 用户名是 `user123`，仓库名称是 `data-analysis-app`，那么您应该设置：
`base: '/data-analysis-app/'`

## 第 3 步：部署您的应用

我们已经在 `package.json` 中为您添加了部署脚本：

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "deploy": "npm run build && npx gh-pages -d dist"
}
```

现在，您可以直接运行部署命令：

```bash
npm run deploy
```

这个命令会执行以下操作：
1. 运行 `npm run build` 编译您的 TypeScript 代码并使用 Vite 打包 React 应用
2. 将打包后的文件输出到 `dist` 目录
3. 使用 `gh-pages` 包将 `dist` 目录的内容部署到您仓库的 `gh-pages` 分支

## 第 4 步：配置 GitHub Pages 设置

1. 打开您的 GitHub 仓库页面
2. 点击顶部导航栏中的 "Settings"（设置）
3. 向下滚动到 "GitHub Pages" 部分
4. 在 "Source"（来源）选项中，选择 `gh-pages` 分支和 `/ (root)` 目录
5. 点击 "Save"（保存）

GitHub 会开始发布您的网站。可能需要几分钟时间才能完全可用。

## 第 5 步：验证部署

几分钟后，您可以访问已部署的应用：
```
https://您的GitHub用户名.github.io/您的仓库名称/
```

## 部署流程解释

当您运行 `npm run deploy` 时，会发生以下步骤：

1. `build` 脚本会编译您的 TypeScript 代码并使用 Vite 打包您的 React 应用
2. 打包后的文件会输出到 `dist` 目录
3. `gh-pages` 包会在您的仓库中创建或更新 `gh-pages` 分支
4. `dist` 目录的内容会被推送到这个分支
5. GitHub Pages 会检测到 `gh-pages` 分支的更改并发布您的网站

## 更新您的部署

当您对应用进行更改并想要更新在线版本时，只需再次运行：

```bash
npm run deploy
```

这将重新构建您的应用并更新 `gh-pages` 分支。

## 故障排除

- **404 错误**：确保您在 `vite.config.ts` 中正确设置了 `base` 路径，使其与您的仓库名称匹配
- **构建失败**：通过运行 `npx tsc --noEmit` 确保您的 TypeScript 代码没有编译错误
- **GitHub Pages 未更新**：尝试清除浏览器缓存或等待几分钟，让 GitHub 处理部署
- **无法加载 CSS 或 JavaScript**：检查 `vite.config.ts` 中的 `base` 配置是否正确

## 初学者常见问题解答

**Q: 我需要先创建 GitHub 仓库吗？**
A: 是的，您需要先在 GitHub 上创建一个仓库，并将您的代码推送到该仓库。

**Q: 我如何找到我的仓库名称？**
A: 您的仓库名称是您在 GitHub 上创建仓库时指定的名称，可以在仓库 URL 中找到：`https://github.com/用户名/仓库名称`

**Q: 部署需要多长时间？**
A: 构建和部署过程通常只需几秒钟，但 GitHub Pages 可能需要额外的几分钟来处理和发布您的网站。

**Q: 我可以使用自定义域名吗？**
A: 是的，GitHub Pages 支持自定义域名。您可以在 GitHub Pages 设置中添加自定义域名。

**Q: 我需要学习 Git 命令吗？**
A: 对于基本部署，您不需要学习太多 Git 命令。本指南中提供的 npm 脚本会处理大部分工作。但了解一些基本的 Git 命令对您管理代码会有帮助。

## 下一步

成功部署后，您可以：
- 与朋友和同事分享您的应用链接
- 继续开发和改进您的统计应用
- 探索 GitHub Pages 的更多功能，如自定义域名