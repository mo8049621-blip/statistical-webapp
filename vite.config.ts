import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 本地开发时使用根路径
  // 部署到GitHub Pages时，需要修改为你的仓库名称
  // 例如：如果仓库地址是 https://github.com/username/repo-name，则设置为 '/repo-name/'
  base: '/',
})