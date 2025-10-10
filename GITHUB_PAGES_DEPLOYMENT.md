# GitHub Pages Deployment Guide

This guide will walk you through deploying your statistical webapp to GitHub Pages.

## Prerequisites
- Your code is already uploaded to a GitHub repository
- You have Node.js and npm installed on your machine

## Step 1: Configure Vite for GitHub Pages

We've already updated the `vite.config.ts` file with a base path configuration. However, you need to update it with your actual repository name:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages
  // If your repo is at https://github.com/username/repo-name, set base: '/repo-name/'
  base: '/your-repository-name/',
})
```

## Step 2: Create a Deployment Script

Let's add a deployment script to your `package.json` file:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "deploy": "npm run build && npx gh-pages -d dist"
}
```

## Step 3: Install the gh-pages Package

Run the following command to install the `gh-pages` npm package, which simplifies deploying to GitHub Pages:

```bash
npm install --save-dev gh-pages
```

## Step 4: Deploy Your Application

Run the deployment script we created:

```bash
npm run deploy
```

This command will:
1. Build your application for production using `npm run build`
2. Deploy the contents of the `dist` directory to the `gh-pages` branch of your repository

## Step 5: Configure GitHub Pages Settings

1. Go to your GitHub repository
2. Click on "Settings" in the top navigation
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select `gh-pages` branch and `/ (root)` directory
5. Click "Save"

GitHub will now publish your site. It may take a few minutes for your site to be available.

## Step 6: Verify Your Deployment

After a few minutes, you can visit your deployed application at:
```
https://your-github-username.github.io/your-repository-name/
```

## Deployment Workflow Explained

When you run `npm run deploy`, here's what happens:

1. The `build` script compiles your TypeScript code and bundles your React application using Vite
2. The bundled files are output to the `dist` directory
3. The `gh-pages` package creates or updates the `gh-pages` branch in your repository
4. The contents of the `dist` directory are pushed to this branch
5. GitHub Pages detects changes to the `gh-pages` branch and publishes your site

## Updating Your Deployment

Whenever you make changes to your application and want to update the live site, simply run:

```bash
npm run deploy
```

This will rebuild your application and update the `gh-pages` branch.

## Troubleshooting

- **404 errors**: Make sure you correctly set the `base` path in `vite.config.ts` to match your repository name
- **Build failures**: Ensure your TypeScript code compiles without errors by running `npx tsc --noEmit`
- **GitHub Pages not updating**: Try clearing your browser cache or wait a few more minutes for GitHub to process the deployment

## Additional Resources
- [Vite Documentation: GitHub Pages Deployment](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)