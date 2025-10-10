import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei', 'Arial Unicode MS', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

try:
    # 读取CSV文件
    df = pd.read_csv('UM_C19_2021.csv')
    
    print("=== COVID-19 检测数据分析报告 ===")
    print(f"文件名称: UM_C19_2021.csv")
    print(f"总行数: {len(df)}")
    print(f"总列数: {len(df.columns)}")
    
    print("\n=== 列名信息 ===")
    for i, col in enumerate(df.columns, 1):
        print(f"{i}. {col}")
    
    print("\n=== 前10行数据预览 ===")
    print(df.head(10).to_string())
    
    print("\n=== 数据类型 ===")
    print(df.dtypes)
    
    # 转换日期格式
    df['Date'] = pd.to_datetime(df['Date'])
    
    print("\n=== 时间范围 ===")
    print(f"开始日期: {df['Date'].min()}")
    print(f"结束日期: {df['Date'].max()}")
    print(f"数据跨度: {(df['Date'].max() - df['Date'].min()).days} 天")
    
    print("\n=== 人员类型统计 ===")
    print(df['Type'].value_counts())
    
    print("\n=== 居住类型统计 ===")
    print(df['residence'].value_counts())
    
    print("\n=== 基本统计信息 ===")
    print("阳性检测统计:")
    print(f"总阳性数: {df['Positive'].sum()}")
    print(f"平均每日阳性数: {df['Positive'].mean():.2f}")
    print(f"最大单日阳性数: {df['Positive'].max()}")
    
    print("\n阴性检测统计:")
    print(f"总阴性数: {df['Negative'].sum()}")
    print(f"平均每日阴性数: {df['Negative'].mean():.2f}")
    print(f"最大单日阴性数: {df['Negative'].max()}")
    
    print("\n=== 阳性率分析 ===")
    df['Total_Tests'] = df['Positive'] + df['Negative']
    df['Positive_Rate'] = (df['Positive'] / df['Total_Tests'] * 100).round(2)
    
    print(f"总体阳性率: {(df['Positive'].sum() / df['Total_Tests'].sum() * 100):.2f}%")
    print(f"平均阳性率: {df['Positive_Rate'].mean():.2f}%")
    print(f"最高阳性率: {df['Positive_Rate'].max():.2f}%")
    
    print("\n=== 按人员类型分析 ===")
    type_analysis = df.groupby('Type').agg({
        'Positive': 'sum',
        'Negative': 'sum',
        'Total_Tests': 'sum'
    }).reset_index()
    type_analysis['Positive_Rate'] = (type_analysis['Positive'] / type_analysis['Total_Tests'] * 100).round(2)
    print(type_analysis)
    
    print("\n=== 按居住类型分析 ===")
    residence_analysis = df.groupby('residence').agg({
        'Positive': 'sum',
        'Negative': 'sum',
        'Total_Tests': 'sum'
    }).reset_index()
    residence_analysis['Positive_Rate'] = (residence_analysis['Positive'] / residence_analysis['Total_Tests'] * 100).round(2)
    print(residence_analysis)
    
    print("\n=== 缺失值统计 ===")
    missing_data = df.isnull().sum()
    if missing_data.sum() > 0:
        print(missing_data[missing_data > 0])
    else:
        print("没有缺失值")
    
    print("\n=== 重复行统计 ===")
    duplicates = df.duplicated().sum()
    print(f"重复行数量: {duplicates}")
    
    # 创建可视化图表
    print("\n=== 生成可视化图表 ===")
    
    # 1. 每日阳性数趋势
    daily_positive = df.groupby('Date')['Positive'].sum().reset_index()
    
    plt.figure(figsize=(15, 10))
    
    plt.subplot(2, 2, 1)
    plt.plot(daily_positive['Date'], daily_positive['Positive'], linewidth=2, color='red')
    plt.title('每日阳性检测数趋势', fontsize=14, fontweight='bold')
    plt.xlabel('日期')
    plt.ylabel('阳性数')
    plt.xticks(rotation=45)
    plt.grid(True, alpha=0.3)
    
    # 2. 按人员类型的阳性数对比
    plt.subplot(2, 2, 2)
    type_positive = df.groupby('Type')['Positive'].sum()
    plt.pie(type_positive.values, labels=type_positive.index, autopct='%1.1f%%', startangle=90)
    plt.title('按人员类型的阳性数分布', fontsize=14, fontweight='bold')
    
    # 3. 按居住类型的阳性率对比
    plt.subplot(2, 2, 3)
    residence_positive_rate = residence_analysis.set_index('residence')['Positive_Rate']
    plt.bar(range(len(residence_positive_rate)), residence_positive_rate.values, color='orange')
    plt.title('按居住类型的阳性率对比', fontsize=14, fontweight='bold')
    plt.xlabel('居住类型')
    plt.ylabel('阳性率 (%)')
    plt.xticks(range(len(residence_positive_rate)), residence_positive_rate.index, rotation=45)
    
    # 4. 月度阳性数统计
    plt.subplot(2, 2, 4)
    df['Month'] = df['Date'].dt.to_period('M')
    monthly_positive = df.groupby('Month')['Positive'].sum()
    plt.bar(range(len(monthly_positive)), monthly_positive.values, color='green')
    plt.title('月度阳性数统计', fontsize=14, fontweight='bold')
    plt.xlabel('月份')
    plt.ylabel('阳性数')
    plt.xticks(range(len(monthly_positive)), [str(x) for x in monthly_positive.index], rotation=45)
    
    plt.tight_layout()
    plt.savefig('covid_analysis.png', dpi=300, bbox_inches='tight')
    print("图表已保存为 'covid_analysis.png'")
    
    # 显示图表
    plt.show()
    
    print("\n=== 关键发现 ===")
    print("1. 数据时间跨度:", f"{(df['Date'].max() - df['Date'].min()).days} 天")
    print("2. 总检测数:", f"{df['Total_Tests'].sum():,}")
    print("3. 总阳性数:", f"{df['Positive'].sum():,}")
    print("4. 总体阳性率:", f"{(df['Positive'].sum() / df['Total_Tests'].sum() * 100):.2f}%")
    print("5. 阳性率最高的人群类型:", residence_analysis.loc[residence_analysis['Positive_Rate'].idxmax(), 'residence'])
    print("6. 阳性率最高的人员类型:", type_analysis.loc[type_analysis['Positive_Rate'].idxmax(), 'Type'])
    
except Exception as e:
    print(f"分析过程中出错: {e}")
    import traceback
    traceback.print_exc()
