const { execSync, spawn } = require('child_process');
const path = require('path');

console.log('='.repeat(50));
console.log('数据分析平台开发服务器启动器');
console.log('='.repeat(50));

// 检查Node.js是否安装
console.log('检查Node.js安装...');
try {
    const nodeVersion = execSync('node --version').toString().trim();
    console.log(`✓ Node.js已安装: ${nodeVersion}`);
} catch (error) {
    console.error('✗ 错误：未找到Node.js');
    console.error('请先安装Node.js，然后重试');
    console.error('按任意键继续...');
    process.stdin.resume();
    process.exit(1);
}

// 检查npm是否安装
console.log('\n检查npm安装...');
try {
    const npmVersion = execSync('npm --version').toString().trim();
    console.log(`✓ npm已安装: ${npmVersion}`);
} catch (error) {
    console.error('✗ 错误：未找到npm');
    console.error('请重新安装Node.js');
    console.error('按任意键继续...');
    process.stdin.resume();
    process.exit(1);
}

// 安装依赖
console.log('\n正在检查并安装项目依赖...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✓ 依赖安装成功');
} catch (error) {
    console.error('✗ 错误：依赖安装失败');
    console.error('按任意键继续...');
    process.stdin.resume();
    process.exit(1);
}

// 启动开发服务器
console.log('\n正在启动开发服务器...');
console.log('请在浏览器中访问以下地址查看网站：');
console.log('- http://localhost:5173/');
console.log('\n如果端口被占用，服务器会自动使用其他端口');
console.log('\n按Ctrl+C可以停止服务器');
console.log('='.repeat(50));

// 启动开发服务器
const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
});

server.on('close', (code) => {
    console.log(`\n开发服务器已关闭，退出码: ${code}`);
    console.log('按任意键关闭...');
    process.stdin.resume();
});

// 等待用户输入后退出
process.stdin.on('data', () => {
    process.exit(0);
});