import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 设置Node.js路径到环境变量
process.env.PATH = 'C:\\Program Files\\nodejs;' + process.env.PATH;

console.log('已临时设置Node.js路径到环境变量');
console.log('正在启动Vite开发服务器...');

// 执行npm run dev命令
const viteProcess = exec('npm run dev', {
  cwd: __dirname
});

// 输出Vite的日志
viteProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});

viteProcess.stderr.on('data', (data) => {
  console.error(data.toString());
});

viteProcess.on('close', (code) => {
  console.log(`Vite服务器已关闭，退出码: ${code}`);
});

// 保持进程运行
process.on('SIGINT', () => {
  console.log('正在关闭Vite服务器...');
  viteProcess.kill();
  process.exit(0);
});