// 此脚本用于帮助设置GitHub仓库名称
// 请在运行部署前先运行此脚本

const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== GitHub Pages 部署配置工具 ===');
console.log('请输入您的GitHub仓库名称（例如：data-analysis-app）：');

readline.question('仓库名称: ', (repoName) => {
  if (!repoName || repoName.trim() === '') {
    console.log('错误：仓库名称不能为空！');
    readline.close();
    return;
  }

  // 更新vite.config.ts文件
  try {
    const viteConfigPath = 'vite.config.ts';
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    
    // 替换base路径配置
    const basePathRegex = /base: ['"][^'"]*['"],/g;
    viteConfig = viteConfig.replace(basePathRegex, `base: '/${repoName.trim()}/',`);
    
    fs.writeFileSync(viteConfigPath, viteConfig, 'utf8');
    console.log(`✅ 已成功更新vite.config.ts，设置base路径为：/${repoName.trim()}/`);
  } catch (error) {
    console.error('❌ 更新vite.config.ts失败:', error.message);
  }

  console.log('\n配置完成！现在您可以运行 npm run deploy 进行部署了。');
  console.log('部署完成后，请在GitHub仓库的设置中配置GitHub Pages。');
  readline.close();
});