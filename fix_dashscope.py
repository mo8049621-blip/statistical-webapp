# -*- coding: utf-8 -*-
"""
DashScope API配置修复与NumPy数组形状问题解决
本文件包含完整的修复代码及保存和运行指南
"""

import os
import numpy as np

# ========== 如何保存此文件 ==========
"""
# 在VS Code中保存文件的步骤：
# 1. 复制这段代码到VS Code编辑器中
# 2. 点击菜单栏的 "文件" > "保存" 或使用快捷键 Ctrl+S
# 3. 在弹出的对话框中，选择保存位置为：c:/Users/wyx33/Desktop/Demo2/
# 4. 文件名称设置为：fix_dashscope.py
# 5. 点击 "保存" 按钮

# 在Python IDLE中保存文件的步骤：
# 1. 打开Python IDLE
# 2. 点击菜单栏的 "File" > "New File"
# 3. 复制这段代码到新文件中
# 4. 点击菜单栏的 "File" > "Save" 或使用快捷键 Ctrl+S
# 5. 在弹出的对话框中，导航到：c:/Users/wyx33/Desktop/Demo2/
# 6. 文件名称设置为：fix_dashscope.py
# 7. 点击 "保存" 按钮
"""

# ========== DashScope API配置 ==========

def configure_dashscope_api(api_key=None):
    """配置DashScope API密钥"""
    # 方法1：直接设置环境变量
    if api_key:
        os.environ['DASHSCOPE_API_KEY'] = api_key
        print("✅ DashScope API密钥已通过环境变量设置")
    
    # 方法2：检查环境变量是否已设置
    if 'DASHSCOPE_API_KEY' not in os.environ:
        # 如果未设置，提示用户设置
        print("❌ 未检测到DASHSCOPE_API_KEY环境变量")
        print("请按照以下步骤设置API密钥：")
        print("1. 访问 https://dashscope.console.aliyun.com/ 获取API密钥")
        print("2. 在系统中设置环境变量：")
        print("   - Windows: 在命令提示符中运行：setx DASHSCOPE_API_KEY \"your_api_key\"")
        print("   - 或在Python代码中直接设置：os.environ['DASHSCOPE_API_KEY'] = 'your_api_key'")
        return False
    
    print("✅ DashScope API密钥配置成功")
    return True

# ========== NumPy数组形状问题解决 ==========

def fix_array_shape_mismatch():
    """解决数组形状不匹配问题示例"""
    print("\n🔧 解决NumPy数组形状不匹配问题...")
    
    # 模拟错误情况
    n_samples = 1000
    seasonal_factor = np.array([0.8, 0.9, 1.0, 1.2, 1.5, 1.7, 1.6, 1.4, 1.1, 0.9, 0.8, 0.7])  # 12个元素
    
    try:
        # 这会引发错误：ValueError: operands could not be broadcast together with shapes (12,) (1000,)
        sales_data = 1000 + 200 * seasonal_factor + np.random.normal(0, 50, n_samples)
    except ValueError as e:
        print(f"❌ 错误重现: {e}")
    
    # 解决方案1：使用np.tile扩展数组
    print("\n💡 解决方案1：使用np.tile扩展数组到匹配长度")
    # 计算需要重复的次数和余数
    repeat_times = n_samples // len(seasonal_factor)
    remainder = n_samples % len(seasonal_factor)
    # 扩展数组
    extended_seasonal = np.tile(seasonal_factor, repeat_times) 
    # 添加剩余部分
    if remainder > 0:
        extended_seasonal = np.concatenate((extended_seasonal, seasonal_factor[:remainder]))
    
    # 现在可以正常计算
    sales_data_fixed1 = 1000 + 200 * extended_seasonal + np.random.normal(0, 50, n_samples)
    print(f"✅ 解决方案1成功：生成了形状为 {sales_data_fixed1.shape} 的数据")
    
    # 解决方案2：使用resize方法调整数组大小
    print("\n💡 解决方案2：使用resize方法调整数组大小")
    resized_seasonal = np.resize(seasonal_factor, n_samples)
    sales_data_fixed2 = 1000 + 200 * resized_seasonal + np.random.normal(0, 50, n_samples)
    print(f"✅ 解决方案2成功：生成了形状为 {sales_data_fixed2.shape} 的数据")

# ========== 主程序测试 ==========

def main():
    # 1. 配置DashScope API密钥（请替换为您的实际密钥）
    # 注意：在实际使用时，建议通过环境变量设置，而不是直接硬编码在代码中
    # api_key = 'your_actual_api_key_here'  # 取消注释并替换为您的API密钥
    # configure_dashscope_api(api_key)  # 如果需要直接设置API密钥
    
    # 2. 检查环境变量配置
    configure_dashscope_api()
    
    # 3. 测试NumPy数组形状问题解决
    fix_array_shape_mismatch()
    
    print("\n📝 文件保存和运行指南：")
    print("1. 将此代码保存为：c:/Users/wyx33/Desktop/Demo2/fix_dashscope.py")
    print("2. 打开命令提示符（cmd）或PowerShell")
    print("3. 导航到保存目录：cd c:/Users/wyx33/Desktop/Demo2")
    print("4. 运行Python文件：python fix_dashscope.py")
    print("5. 如果需要设置API密钥，请修改代码中的api_key变量或设置环境变量")

if __name__ == "__main__":
    main()