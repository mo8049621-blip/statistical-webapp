import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os

# 设置中文显示
plt.rcParams['font.sans-serif'] = ['SimHei']  # 用来正常显示中文标签
plt.rcParams['axes.unicode_minus'] = False  # 用来正常显示负号

# 读取CSV文件
def load_data(file_path):
    try:
        data = pd.read_csv(file_path)
        print(f"成功读取数据，共 {len(data)} 行")
        return data
    except Exception as e:
        print(f"读取文件出错: {e}")
        return None

# 数据预处理
def preprocess_data(data):
    # 转换日期列
    data['Date'] = pd.to_datetime(data['Date'])
    
    # 添加月份列以便按月分析
    data['Month'] = data['Date'].dt.month_name()
    
    # 计算每日总测试数
    data['Total_Tests'] = data['Positive'] + data['Negative']
    
    # 计算阳性率
    data['Positive_Rate'] = data['Positive'] / data['Total_Tests'] * 100
    data['Positive_Rate'] = data['Positive_Rate'].fillna(0)  # 处理除以0的情况
    
    return data

# 基本统计分析
def basic_statistics(data):
    print("\n=== 基本统计信息 ===")
    
    # 总阳性、阴性和测试数
    total_positive = data['Positive'].sum()
    total_negative = data['Negative'].sum()
    total_tests = total_positive + total_negative
    
    print(f"总测试数: {total_tests}")
    print(f"总阳性数: {total_positive}")
    print(f"总阴性数: {total_negative}")
    print(f"总体阳性率: {total_positive / total_tests * 100:.2f}%")
    
    # 按人员类型统计
    print("\n=== 按人员类型统计 ===")
    type_stats = data.groupby('Type').agg({
        'Positive': 'sum',
        'Negative': 'sum',
        'Total_Tests': 'sum'
    }).reset_index()
    type_stats['Positive_Rate'] = type_stats['Positive'] / type_stats['Total_Tests'] * 100
    print(type_stats)
    
    # 按居住类型统计
    print("\n=== 按居住类型统计 ===")
    residence_stats = data.groupby('residence').agg({
        'Positive': 'sum',
        'Negative': 'sum',
        'Total_Tests': 'sum'
    }).reset_index()
    residence_stats['Positive_Rate'] = residence_stats['Positive'] / residence_stats['Total_Tests'] * 100
    print(residence_stats)
    
    # 按月统计
    print("\n=== 按月统计 ===")
    month_order = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
    month_stats = data.groupby('Month').agg({
        'Positive': 'sum',
        'Negative': 'sum',
        'Total_Tests': 'sum'
    }).reindex(month_order).reset_index().dropna()
    month_stats['Positive_Rate'] = month_stats['Positive'] / month_stats['Total_Tests'] * 100
    print(month_stats)
    
    return type_stats, residence_stats, month_stats

# 数据可视化
def visualize_data(data, type_stats, residence_stats, month_stats):
    # 创建图表保存目录
    if not os.path.exists('charts'):
        os.makedirs('charts')
    
    # 1. 按人员类型的阳性和阴性对比
    plt.figure(figsize=(12, 6))
    type_stats_melt = type_stats.melt(id_vars=['Type'], value_vars=['Positive', 'Negative'], 
                                     var_name='Result', value_name='Count')
    sns.barplot(x='Type', y='Count', hue='Result', data=type_stats_melt)
    plt.title('不同人员类型的COVID-19测试结果')
    plt.ylabel('数量')
    plt.savefig('charts/type_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # 2. 按居住类型的阳性和阴性对比
    plt.figure(figsize=(12, 6))
    residence_stats_melt = residence_stats.melt(id_vars=['residence'], value_vars=['Positive', 'Negative'], 
                                               var_name='Result', value_name='Count')
    sns.barplot(x='residence', y='Count', hue='Result', data=residence_stats_melt)
    plt.title('不同居住类型的COVID-19测试结果')
    plt.ylabel('数量')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('charts/residence_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # 3. 按月的阳性和阴性趋势
    plt.figure(figsize=(14, 8))
    plt.plot(month_stats['Month'], month_stats['Positive'], marker='o', label='阳性')
    plt.plot(month_stats['Month'], month_stats['Negative'], marker='s', label='阴性')
    plt.title('按月COVID-19测试结果趋势')
    plt.xlabel('月份')
    plt.ylabel('数量')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('charts/monthly_trend.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # 4. 阳性率对比（按人员类型和居住类型）
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    
    sns.barplot(x='Type', y='Positive_Rate', data=type_stats, ax=ax1)
    ax1.set_title('不同人员类型的阳性率')
    ax1.set_ylabel('阳性率 (%)')
    
    sns.barplot(x='residence', y='Positive_Rate', data=residence_stats, ax=ax2)
    ax2.set_title('不同居住类型的阳性率')
    ax2.set_ylabel('阳性率 (%)')
    ax2.tick_params(axis='x', rotation=45)
    ax2.set_xticklabels(ax2.get_xticklabels(), ha='right')
    
    plt.tight_layout()
    plt.savefig('charts/positive_rate_comparison.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # 5. 总体阳性率趋势
    # 先按日期聚合数据
    daily_data = data.groupby('Date').agg({
        'Positive': 'sum',
        'Negative': 'sum',
        'Total_Tests': 'sum'
    }).reset_index()
    daily_data['Positive_Rate'] = daily_data['Positive'] / daily_data['Total_Tests'] * 100
    daily_data['Positive_Rate'] = daily_data['Positive_Rate'].fillna(0)
    
    # 计算7天移动平均
    daily_data['7-Day Avg Positive Rate'] = daily_data['Positive_Rate'].rolling(window=7).mean()
    
    plt.figure(figsize=(14, 8))
    plt.plot(daily_data['Date'], daily_data['Positive_Rate'], alpha=0.3, label='每日阳性率')
    plt.plot(daily_data['Date'], daily_data['7-Day Avg Positive Rate'], color='red', label='7天移动平均阳性率')
    plt.title('COVID-19阳性率趋势')
    plt.xlabel('日期')
    plt.ylabel('阳性率 (%)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('charts/positive_rate_trend.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("\n图表已保存到 charts 文件夹中")

# 主函数
def main():
    # 文件路径
    file_path = 'UM_C19_2021.csv'
    
    # 读取数据
    data = load_data(file_path)
    if data is None:
        return
    
    # 数据预处理
    data = preprocess_data(data)
    
    # 基本统计分析
    type_stats, residence_stats, month_stats = basic_statistics(data)
    
    # 数据可视化
    visualize_data(data, type_stats, residence_stats, month_stats)
    
    # 输出数据洞察
    print("\n=== 数据洞察 ===")
    print("1. 从统计结果可以看出不同人员类型和居住类型的COVID-19感染情况差异")
    print("2. 按月趋势图展示了疫情的发展变化")
    print("3. 阳性率分析有助于了解测试的有效性和疫情严重程度")
    print("4. 所有分析图表已保存到charts文件夹，可供进一步查看和使用")

if __name__ == "__main__":
    main()