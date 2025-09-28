// 统计计算工具函数
// 导入math库已移除，因为当前实现不再需要

/**
 * 计算MLE估计
 */
export const calculateMLE = (data: number[], distType: string): Record<string, number> => {
  const results: Record<string, number> = {};
  const n = data.length;
  
  switch (distType) {
    case 'normal': {
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      const std = Math.sqrt(variance);
      results.mean = mean;
      results.std = std;
      break;
    }
    case 'uniform': {
      const min = Math.min(...data);
      const max = Math.max(...data);
      results.a = min;
      results.b = max;
      break;
    }
    case 'exponential': {
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      results.lambda = 1 / mean;
      break;
    }
    case 'poisson': {
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      results.lambda = mean;
      break;
    }
    case 'gamma': {
      // 伽马分布的MoM估计作为MLE的替代方案
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      
      // 使用MoM估计作为简化版的MLE
      results.shape = Math.max(0.001, Math.pow(mean, 2) / variance);
      results.scale = variance / mean;
      break;
    }
    case 'beta': {
      // 贝塔分布的MoM估计作为MLE的替代方案
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      
      // 使用MoM估计作为简化版的MLE
      const s = (mean * (1 - mean) / variance) - 1;
      results.alpha = mean * s;
      results.beta = (1 - mean) * s;
      break;
    }
    default:
      throw new Error(`不支持的分布类型: ${distType}`);
  }
  
  return results;
};

/**
 * 计算MoM估计
 */
export const calculateMoM = (data: number[], distType: string): Record<string, number> => {
  const results: Record<string, number> = {};
  const n = data.length;
  
  switch (distType) {
    case 'normal': {
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      const std = Math.sqrt(variance);
      results.mean = mean;
      results.std = std;
      break;
    }
    case 'uniform': {
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      const range = Math.sqrt(12 * variance);
      results.a = mean - range / 2;
      results.b = mean + range / 2;
      break;
    }
    case 'exponential': {
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      results.lambda = 1 / mean;
      break;
    }
    case 'poisson': {
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      results.lambda = mean;
      break;
    }
    case 'gamma': {
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      
      // MoM估计：shape = mean^2 / variance, scale = variance / mean
      results.shape = Math.max(0.001, Math.pow(mean, 2) / variance);
      results.scale = variance / mean;
      break;
    }
    case 'beta': {
      const mean = data.reduce((sum, val) => sum + val, 0) / n;
      const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      
      // MoM估计
      const s = (mean * (1 - mean) / variance) - 1;
      results.alpha = mean * s;
      results.beta = (1 - mean) * s;
      break;
    }
    default:
      throw new Error(`不支持的分布类型: ${distType}`);
  }
  
  return results;
};

/**
 * 计算偏度
 */
export const calculateSkewness = (data: number[]): number => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  const n = data.length;
  const mean = calculateMean(data);
  const std = calculateStd(data);
  
  // 确保标准差不为零
  if (std === 0) {
    return 0;
  }
  
  const thirdMoment = data.reduce((sum, val) => sum + Math.pow(val - mean, 3), 0) / n;
  return thirdMoment / Math.pow(std, 3);
};

/**
 * 计算峰度
 */
export const calculateKurtosis = (data: number[]): number => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  const n = data.length;
  const mean = calculateMean(data);
  const std = calculateStd(data);
  
  // 确保标准差不为零
  if (std === 0) {
    return 0;
  }
  
  const fourthMoment = data.reduce((sum, val) => sum + Math.pow(val - mean, 4), 0) / n;
  return (fourthMoment / Math.pow(std, 4)) - 3; // 减去3得到超额峰度
};

/**
 * 计算数组的均值
 */
export const calculateMean = (data: number[]): number => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
};

/**
 * 计算数组的中位数
 */
export const calculateMedian = (data: number[]): number => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  const sortedData = [...data].sort((a, b) => a - b);
  const n = sortedData.length;
  
  if (n % 2 === 0) {
    return (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2;
  } else {
    return sortedData[Math.floor(n / 2)];
  }
};

/**
 * 计算数组的众数
 */
export const calculateMode = (data: number[]): number | null => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  const frequencyMap: Record<number, number> = {};
  let maxFreq = 0;
  let mode: number | null = null;
  
  data.forEach((num) => {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    if (frequencyMap[num] > maxFreq) {
      maxFreq = frequencyMap[num];
      mode = num;
    } else if (frequencyMap[num] === maxFreq && num !== mode) {
      mode = null; // 多众数情况
    }
  });
  
  return mode;
};

/**
 * 计算数组的方差
 */
export const calculateVariance = (data: number[]): number => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  const mean = calculateMean(data);
  const sumSquaredDiffs = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  return sumSquaredDiffs / data.length;
};

/**
 * 计算数组的标准差
 */
export const calculateStd = (data: number[]): number => {
  return Math.sqrt(calculateVariance(data));
};

/**
 * 计算数组的四分位数
 */
export const calculateQuartiles = (data: number[]): { q1: number; q3: number; iqr: number } => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  const sortedData = [...data].sort((a, b) => a - b);
  const n = sortedData.length;
  
  const q1 = sortedData[Math.floor(n * 0.25)];
  const q3 = sortedData[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  
  return { q1, q3, iqr };
};

/**
 * 计算描述性统计量
 */
export const calculateDescriptiveStats = (data: number[]): {
  mean: number;
  median: number;
  mode: number | null;
  variance: number;
  std: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  count: number;
} => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  const sortedData = [...data].sort((a, b) => a - b);
  const n = sortedData.length;
  
  return {
    mean: calculateMean(data),
    median: calculateMedian(data),
    mode: calculateMode(data),
    variance: calculateVariance(data),
    std: calculateStd(data),
    min: sortedData[0],
    max: sortedData[n - 1],
    range: sortedData[n - 1] - sortedData[0],
    ...calculateQuartiles(data),
    count: n,
  };
};

/**
 * 生成直方图数据
 */
export const generateHistogramData = (data: number[], numBins?: number): { name: string; value: number }[] => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  const n = data.length;
  const binsCount = numBins || Math.ceil(Math.sqrt(n));
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / binsCount;
  
  const bins: { name: string; value: number }[] = [];
  
  for (let i = 0; i < binsCount; i++) {
    const binMin = min + i * binWidth;
    const binMax = binMin + binWidth;
    const count = data.filter((val) => val >= binMin && val < binMax).length;
    bins.push({
      name: `${binMin.toFixed(2)}-${binMax.toFixed(2)}`,
      value: count,
    });
  }
  
  return bins;
};