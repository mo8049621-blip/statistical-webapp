#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DashScope API配置与测试演示
用于帮助配置阿里云通义千问API并解决NumPy数组形状不匹配问题
"""

import os
import numpy as np
import pandas as pd
from dashscope import Generation

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
        print("   - Windows: setx DASHSCOPE_API_KEY ""your_api_key""")
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
    
    # 解决方案1：使用NumPy的tile函数重复数组
    seasonal_factor_expanded = np.tile(seasonal_factor, n_samples // 12 + 1)[:n_samples]
    sales_data1 = 1000 + 200 * seasonal_factor_expanded + np.random.normal(0, 50, n_samples)
    print(f"✅ 解决方案1 (使用tile): 生成了 {len(sales_data1)} 个数据点")
    
    # 解决方案2：使用NumPy的resize函数调整数组大小
    seasonal_factor_resized = np.resize(seasonal_factor, n_samples)
    sales_data2 = 1000 + 200 * seasonal_factor_resized + np.random.normal(0, 50, n_samples)
    print(f"✅ 解决方案2 (使用resize): 生成了 {len(sales_data2)} 个数据点")
    
    # 解决方案3：使用插值方法扩展数组
    from scipy import interpolate
    x = np.linspace(0, 11, 12)
    f = interpolate.interp1d(x, seasonal_factor, kind='cubic')
    x_new = np.linspace(0, 11, n_samples)
    seasonal_factor_interpolated = f(x_new)
    sales_data3 = 1000 + 200 * seasonal_factor_interpolated + np.random.normal(0, 50, n_samples)
    print(f"✅ 解决方案3 (使用插值): 生成了 {len(sales_data3)} 个数据点")
    
    return sales_data1

# ========== 测试DashScope API调用 ==========

def test_dashscope_api(prompt="生成100个符合正态分布的随机数的JSON数据"):
    """测试DashScope API调用"""
    print("\n📡 测试DashScope API调用...")
    
    try:
        response = Generation.call(
            model='qwen-plus',  # 或其他可用模型如 'qwen-turbo', 'qwen-max'
            prompt=prompt,
            result_format='message',
        )
        
        if response.status_code == 200:
            print("✅ API调用成功!")
            print(f"📝 响应内容: {response.output['text'][:100]}...")
            return response.output['text']
        else:
            print(f"❌ API调用失败: {response.code} - {response.message}")
            print("请检查API密钥是否正确，以及是否有足够的调用额度")
            return None
    except Exception as e:
        print(f"❌ API调用异常: {str(e)}")
        print("可能的原因：")
        print("1. API密钥未正确配置")
        print("2. 网络连接问题")
        print("3. 阿里云服务暂时不可用")
        return None

# ========== 生成统计数据 ==========

def generate_statistical_data(n_samples=1000):
    """生成统计数据示例"""
    print("\n📊 生成统计数据...")
    
    # 生成日期数据
    dates = pd.date_range(start='2024-01-01', periods=n_samples, freq='D')
    
    # 生成季节性因子并正确扩展
    seasonal_factor = np.array([0.8, 0.9, 1.0, 1.2, 1.5, 1.7, 1.6, 1.4, 1.1, 0.9, 0.8, 0.7])
    seasonal_factor_expanded = np.tile(seasonal_factor, n_samples // 12 + 1)[:n_samples]
    
    # 生成符合正态分布的销售数据
    sales_data = 1000 + 200 * seasonal_factor_expanded + np.random.normal(0, 50, n_samples)
    
    # 生成符合二项分布的转化率数据
    conversion_rates = np.random.binomial(100, 0.05, n_samples) / 100
    
    # 生成符合泊松分布的访问量数据
    visits = np.random.poisson(lam=200, size=n_samples)
    
    # 创建DataFrame
    df = pd.DataFrame({
        'date': dates,
        'sales': sales_data,
        'conversion_rate': conversion_rates,
        'visits': visits
    })
    
    # 计算统计信息
    stats = {
        'sales_mean': df['sales'].mean(),
        'sales_std': df['sales'].std(),
        'conversion_mean': df['conversion_rate'].mean(),
        'visits_mean': df['visits'].mean()
    }
    
    print(f"✅ 数据生成完成: {n_samples} 行数据")
    print(f"📈 销售数据均值: {stats['sales_mean']:.2f}")
    print(f"📈 转化率均值: {stats['conversion_mean']:.4f}")
    print(f"📈 访问量均值: {stats['visits_mean']:.2f}")
    
    # 保存数据到CSV
    df.to_csv('statistical_data.csv', index=False)
    print("💾 数据已保存到 statistical_data.csv")
    
    return df, stats

# ========== 主函数 ==========

def main():
    print("🚀 DashScope API配置与测试工具启动")
    
    # 1. 配置API密钥（可选：传入您的API密钥作为参数）
    # configure_dashscope_api("your_api_key_here")  # 取消注释并填入您的API密钥
    configure_dashscope_api()  # 使用环境变量中的API密钥
    
    # 2. 解决NumPy数组形状问题
    fix_array_shape_mismatch()
    
    # 3. 生成统计数据（不含API调用）
    df, stats = generate_statistical_data()
    
    # 4. 测试API调用（如果API配置成功）
    if 'DASHSCOPE_API_KEY' in os.environ:
        api_response = test_dashscope_api(
            "为一个统计Web应用生成一些样本数据的描述，包含正态分布、二项分布和泊松分布"
        )
    
    print("\n🎉 演示完成！请查看生成的statistical_data.csv文件")
    print("📚 使用指南：")
    print("1. 确保已安装所需依赖：pip install dashscope numpy pandas scipy")
    print("2. 设置环境变量：setx DASHSCOPE_API_KEY \"your_api_key\"（Windows）")
    print("3. 重新打开命令提示符以应用环境变量")
    print("4. 运行：python dashscope_api_demo.py")

if __name__ == "__main__":
    main()