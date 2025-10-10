# GitHub Pages 部署快速指南

本文件将帮助您快速了解如何使用提供的工具将您的统计网页应用部署到GitHub Pages。

## 部署前的准备工作

1. 确保您已经：
   - 在GitHub上创建了仓库
   - 将您的代码上传到了这个仓库
   - 安装了Node.js和npm

2. 检查项目根目录中是否有以下文件：
   - `设置GitHub仓库名称.bat` - 用于设置您的GitHub仓库名称
   - `部署到GitHub Pages.bat` - 用于一键部署应用
   - `GITHUB_PAGES_DEPLOYMENT_CN.md` - 详细的部署指南

## 部署步骤

### 步骤1：设置您的GitHub仓库名称

1. 双击运行 `设置GitHub仓库名称.bat` 文件
2. 在命令窗口中输入您的GitHub仓库名称（例如：`data-analysis-app`）
3. 按Enter键确认
4. 脚本会自动更新`vite.config.ts`文件中的base路径配置

### 步骤2：部署应用到GitHub Pages

1. 双击运行 `部署到GitHub Pages.bat` 文件
2. 等待脚本执行构建和部署操作
3. 如果部署成功，您将看到成功提示

### 步骤3：在GitHub上配置Pages

1. 打开您的GitHub仓库页面
2. 点击顶部导航栏中的 "Settings"（设置）
3. 向下滚动到 "GitHub Pages" 部分
4. 在 "Source"（来源）选项中，选择 `gh-pages` 分支和 `/ (root)` 目录
5. 点击 "Save"（保存）

## 等待部署完成

GitHub Pages可能需要几分钟时间来处理和发布您的网站。完成后，您可以通过以下链接访问您的应用：
```
https://您的GitHub用户名.github.io/您的仓库名称/
```

## 常见问题解决

- **部署失败提示未登录GitHub**：请确保您已通过GitHub Desktop或Git命令行登录GitHub
- **网站无法正常显示（404错误）**：检查是否正确设置了仓库名称
- **样式或JavaScript文件无法加载**：确认`vite.config.ts`中的base路径是否设置正确
- **构建失败**：查看错误信息，可能是代码中有语法错误或缺少依赖

## 查看详细信息

如果您想了解更多关于GitHub Pages部署的详细信息，请参考 `GITHUB_PAGES_DEPLOYMENT_CN.md` 文件。

## 更新您的部署

当您对应用进行更改后，只需重复 **步骤2** 即可更新您的在线版本。