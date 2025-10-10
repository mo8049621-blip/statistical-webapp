// 数据输入类型
export type DataInputType = 'file' | 'distribution' | 'ai';

// 分布类型
export type DistributionType = 'normal' | 'binomial' | 'poisson';

// 分布参数接口
export interface DistributionParams {
  mean?: number;      // 均值 (正态分布)
  stdDev?: number;    // 标准差 (正态分布)
  trials?: number;    // 试验次数 (二项分布)
  probability?: number; // 成功概率 (二项分布)
  lambda?: number;    // lambda参数 (泊松分布)
  sampleSize?: number; // 样本大小
}

// 数据集接口
export interface DataSet {
  id: string;
  name: string;
  type: DataInputType;
  source: string;
  data: number[];
  createdAt: Date;
  metadata?: Record<string, any>;
}

// 统计结果接口
export interface StatisticsResult {
  mean: number;          // 均值
  variance: number;      // 方差
  stdDev: number;        // 标准差
  median: number;        // 中位数
  min: number;           // 最小值
  max: number;           // 最大值
  q1: number;            // 第一四分位数
  q3: number;            // 第三四分位数
  skewness: number;      // 偏度
  kurtosis: number;      // 峰度
  count: number;         // 数据点数量
}

// MLE和MoM估计结果接口
export interface EstimationResult {
  distribution: DistributionType;
  mleParams: Record<string, number>;
  momParams: Record<string, number>;
  confidenceIntervals: Record<string, [number, number]>;
}

// 图表数据点接口
export interface ChartDataPoint {
  x: number;
  y: number;
}