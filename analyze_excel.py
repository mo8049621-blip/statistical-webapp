import pandas as pd
import sys

try:
    # 读取Excel文件
    df = pd.read_excel('子墨比赛实践咨询chatgpt.xlsx', engine='openpyxl')
    
    print("=== Excel文件分析报告 ===")
    print(f"文件名称: 子墨比赛实践咨询chatgpt.xlsx")
    print(f"总行数: {len(df)}")
    print(f"总列数: {len(df.columns)}")
    
    print("\n=== 列名信息 ===")
    for i, col in enumerate(df.columns, 1):
        print(f"{i}. {col}")
    
    print("\n=== 前5行数据预览 ===")
    print(df.head().to_string())
    
    print("\n=== 数据类型 ===")
    print(df.dtypes)
    
    print("\n=== 基本统计信息 ===")
    print(df.describe())
    
    print("\n=== 缺失值统计 ===")
    missing_data = df.isnull().sum()
    if missing_data.sum() > 0:
        print(missing_data[missing_data > 0])
    else:
        print("没有缺失值")
    
    print("\n=== 重复行统计 ===")
    duplicates = df.duplicated().sum()
    print(f"重复行数量: {duplicates}")
    
except Exception as e:
    print(f"读取文件时出错: {e}")
    print("请检查文件是否存在且格式正确")
