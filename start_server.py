import os
import subprocess
import sys

print("=" * 50)
print("数据分析平台开发服务器启动器")
print("=" * 50)

# 检查Node.js是否安装
try:
    subprocess.run(["node", "--version"], check=True, capture_output=True)
    print("✓ Node.js已正确安装")
except (subprocess.SubprocessError, FileNotFoundError):
    print("✗ 错误：未找到Node.js")
    print("请先安装Node.js，然后重试")
    input("按Enter键退出...")
    sys.exit(1)

# 检查npm是否安装
try:
    subprocess.run(["npm", "--version"], check=True, capture_output=True)
    print("✓ npm已正确安装")
except (subprocess.SubprocessError, FileNotFoundError):
    print("✗ 错误：未找到npm")
    print("请重新安装Node.js")
    input("按Enter键退出...")
    sys.exit(1)

# 安装依赖
print("\n正在检查并安装项目依赖...")
try:
    subprocess.run(["npm", "install"], check=True)
    print("✓ 依赖安装成功")
except subprocess.SubprocessError:
    print("✗ 错误：依赖安装失败")
    input("按Enter键退出...")
    sys.exit(1)

# 启动开发服务器
print("\n正在启动开发服务器...")
print("请在浏览器中访问以下地址查看网站：")
print("- http://localhost:5173/")
print("\n如果端口被占用，服务器会自动使用其他端口")
print("\n按Ctrl+C可以停止服务器")
print("=" * 50)

# 使用cmd启动开发服务器，确保窗口不会关闭
subprocess.run(["cmd", "/k", "npm run dev"])