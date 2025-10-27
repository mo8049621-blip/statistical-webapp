// 统计计算工具函数
// 导入math库已移除，因为当前实现不再需要

/**
 * 计算MLE估计
 */
export const calculateMLE = (data: number[], distType: string, basicStats?: any): Record<string, number> => {
  const results: Record<string, number> = {};
  const n = data.length;
  
  // 优先使用传入的统计量，如果没有则计算
  let mean = basicStats?.mean;
  let variance = basicStats?.variance || (basicStats?.std ? basicStats.std * basicStats.std : undefined);
  
  switch (distType) {
    case 'normal': {
      if (!mean || !variance) {
        mean = data.reduce((sum, val) => sum + val, 0) / n;
        variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      }
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
      if (!mean) {
        mean = data.reduce((sum, val) => sum + val, 0) / n;
      }
      results.lambda = 1 / mean;
      break;
    }
    case 'poisson': {
      if (!mean) {
        mean = data.reduce((sum, val) => sum + val, 0) / n;
      }
      results.lambda = mean;
      break;
    }
    case 'gamma': {
      // 伽马分布的MoM估计作为MLE的替代方案
      if (!mean || !variance) {
        mean = data.reduce((sum, val) => sum + val, 0) / n;
        variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      }
      
      // 使用MoM估计作为简化版的MLE
      results.shape = Math.max(0.001, Math.pow(mean, 2) / variance);
      results.scale = variance / mean;
      break;
    }
    case 'beta': {
      // 贝塔分布的MoM估计作为MLE的替代方案
      if (!mean || !variance) {
        mean = data.reduce((sum, val) => sum + val, 0) / n;
        variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      }
      
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
export const calculateMoM = (data: number[], distType: string, basicStats?: any): Record<string, number> => {
  const results: Record<string, number> = {};
  const n = data.length;
  
  // 优先使用传入的统计量，如果没有则计算
  let mean = basicStats?.mean;
  let variance = basicStats?.variance || (basicStats?.std ? basicStats.std * basicStats.std : undefined);
  
  switch (distType) {
    case 'normal': {
      if (!mean || !variance) {
        mean = data.reduce((sum, val) => sum + val, 0) / n;
        variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      }
      const std = Math.sqrt(variance);
      results.mean = mean;
      results.std = std;
      break;
    }
    case 'uniform': {
      if (!mean || !variance) {
        mean = data.reduce((sum, val) => sum + val, 0) / n;
        variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      }
      const range = Math.sqrt(12 * variance);
      results.a = mean - range / 2;
      results.b = mean + range / 2;
      break;
    }
    case 'exponential': {
      if (!mean) {
        mean = data.reduce((sum, val) => sum + val, 0) / n;
      }
      results.lambda = 1 / mean;
      break;
    }
    case 'poisson': {
      if (!mean) {
        mean = data.reduce((sum, val) => sum + val, 0) / n;
      }
      results.lambda = mean;
      break;
    }
    case 'gamma': {
      if (!mean || !variance) {
        mean = data.reduce((sum, val) => sum + val, 0) / n;
        variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      }
      
      // MoM估计：shape = mean^2 / variance, scale = variance / mean
      results.shape = Math.max(0.001, Math.pow(mean, 2) / variance);
      results.scale = variance / mean;
      break;
    }
    case 'beta': {
      if (!mean || !variance) {
        mean = data.reduce((sum, val) => sum + val, 0) / n;
        variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      }
      
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
export const calculateSkewness = (data: number[], basicStats?: { count: number; mean: number } | null): number => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  // 计算样本统计量，优先使用传入的统计量
  const n = basicStats?.count || data.length;
  const mean = basicStats?.mean || calculateMean(data);
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
export const calculateKurtosis = (data: number[], basicStats?: { count: number; mean: number; std: number } | null): number => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  // 计算样本统计量，优先使用传入的统计量
  const n = basicStats?.count || data.length;
  const mean = basicStats?.mean || calculateMean(data);
  const std = basicStats?.std || calculateStd(data);
  
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
export const calculateMode = (data: number[]): number[] => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  const frequencyMap: Record<number, number> = {};
  let maxFreq = 0;
  
  // 计算频率并找出最大频率
  data.forEach((num) => {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    maxFreq = Math.max(maxFreq, frequencyMap[num]);
  });
  
  // 收集所有具有最大频率的数字
  const modes: number[] = [];
  Object.entries(frequencyMap).forEach(([num, freq]) => {
    if (freq === maxFreq) {
      modes.push(Number(num));
    }
  });
  
  return modes;
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
 * 计算均值的置信区间
 * 支持四种情况：
 * 1. 正态分布，方差已知
 * 2. 非正态分布，方差已知（大样本）
 * 3. 正态分布，方差未知（使用t分布）
 * 4. 非正态分布，方差未知（大样本）
 * 
 * @param data 数据数组
 * @param confidenceLevel 置信水平，默认为0.95（95%）
 * @param options 可选参数
 * @param options.isNormal 是否假设正态分布，默认为false
 * @param options.knownVariance 是否已知方差，默认为false
 * @param options.populationVariance 总体方差（如果已知）
 * @returns 包含置信区间下限、上限、边际误差和使用的方法的对象
 */
export const calculateConfidenceInterval = (data: number[], confidenceLevel: number = 0.95, options: {
  isNormal?: boolean;
  knownVariance?: boolean;
  populationVariance?: number;
} = {}): { 
  lower: number; 
  upper: number; 
  marginOfError: number;
  method: string;
  criticalValue: number;
} => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  const { isNormal = false, knownVariance = false, populationVariance } = options;
  const n = data.length;
  const mean = calculateMean(data);
  
  // 计算标准误
  let standardError: number;
  let std: number;
  
  if (knownVariance && populationVariance !== undefined) {
    // 方差已知情况
    standardError = Math.sqrt(populationVariance) / Math.sqrt(n);
    std = Math.sqrt(populationVariance);
  } else {
    // 方差未知情况，使用样本标准差
    std = calculateStd(data);
    standardError = std / Math.sqrt(n);
  }
  
  // 确定使用z分布还是t分布
  let criticalValue: number;
  let method: string;
  
  if (knownVariance) {
    // 方差已知，使用z分布
    // 根据置信水平计算z临界值
    switch (confidenceLevel) {
      case 0.90:
        criticalValue = 1.645;
        break;
      case 0.95:
        criticalValue = 1.96;
        break;
      case 0.99:
        criticalValue = 2.576;
        break;
      default:
        // 对于其他置信水平，使用近似值
        const alpha = 1 - confidenceLevel;
        // 使用误差函数的逆函数近似计算z值
        // 这里使用泰勒展开近似
        const zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha/2) - 1);
        criticalValue = Math.abs(zApprox);
    }
    method = knownVariance ? 'Z分布（方差已知）' : 'Z分布（方差未知，大样本）';
  } else {
    // 方差未知
    if (isNormal || n <= 30) {
      // 正态分布或小样本，使用t分布
      // 这里使用近似的t临界值表
      const df = n - 1;
      criticalValue = getApproximateTCriticalValue(df, confidenceLevel);
      method = 't分布（正态分布，方差未知）';
    } else {
      // 非正态大样本，使用z分布近似
      switch (confidenceLevel) {
        case 0.90:
          criticalValue = 1.645;
          break;
        case 0.95:
          criticalValue = 1.96;
          break;
        case 0.99:
          criticalValue = 2.576;
          break;
        default:
          const alpha = 1 - confidenceLevel;
          const zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha/2) - 1);
          criticalValue = Math.abs(zApprox);
      }
      method = 'Z分布（非正态，大样本，方差未知）';
    }
  }
  
  // 计算边际误差
  const marginOfError = criticalValue * standardError;
  
  // 计算置信区间
  const lower = mean - marginOfError;
  const upper = mean + marginOfError;
  
  return { lower, upper, marginOfError, method, criticalValue };
};

/**
 * 近似计算t分布临界值
 * @param df t分布的自由度
 * @param confidenceLevel 置信水平
 * @returns t临界值
 */
const getApproximateTCriticalValue = (df: number, confidenceLevel: number): number => {
  // 常见自由度和置信水平的t临界值表（近似值）
  const tTable: Record<number, Record<number, number>> = {
    1: { 0.90: 6.314, 0.95: 12.706, 0.99: 63.657 },
    2: { 0.90: 2.920, 0.95: 4.303, 0.99: 9.925 },
    3: { 0.90: 2.353, 0.95: 3.182, 0.99: 5.841 },
    4: { 0.90: 2.132, 0.95: 2.776, 0.99: 4.604 },
    5: { 0.90: 2.015, 0.95: 2.571, 0.99: 4.032 },
    6: { 0.90: 1.943, 0.95: 2.447, 0.99: 3.707 },
    7: { 0.90: 1.895, 0.95: 2.365, 0.99: 3.499 },
    8: { 0.90: 1.860, 0.95: 2.306, 0.99: 3.355 },
    9: { 0.90: 1.833, 0.95: 2.262, 0.99: 3.250 },
    10: { 0.90: 1.812, 0.95: 2.228, 0.99: 3.169 },
    11: { 0.90: 1.796, 0.95: 2.201, 0.99: 3.106 },
    12: { 0.90: 1.782, 0.95: 2.179, 0.99: 3.055 },
    13: { 0.90: 1.771, 0.95: 2.160, 0.99: 3.012 },
    14: { 0.90: 1.761, 0.95: 2.145, 0.99: 2.977 },
    15: { 0.90: 1.753, 0.95: 2.131, 0.99: 2.947 },
    16: { 0.90: 1.746, 0.95: 2.120, 0.99: 2.921 },
    17: { 0.90: 1.740, 0.95: 2.110, 0.99: 2.898 },
    18: { 0.90: 1.734, 0.95: 2.101, 0.99: 2.878 },
    19: { 0.90: 1.729, 0.95: 2.093, 0.99: 2.861 },
    20: { 0.90: 1.725, 0.95: 2.086, 0.99: 2.845 },
    21: { 0.90: 1.721, 0.95: 2.080, 0.99: 2.831 },
    22: { 0.90: 1.717, 0.95: 2.074, 0.99: 2.819 },
    23: { 0.90: 1.714, 0.95: 2.069, 0.99: 2.807 },
    24: { 0.90: 1.711, 0.95: 2.064, 0.99: 2.797 },
    25: { 0.90: 1.708, 0.95: 2.060, 0.99: 2.787 },
    30: { 0.90: 1.697, 0.95: 2.042, 0.99: 2.750 },
    40: { 0.90: 1.684, 0.95: 2.021, 0.99: 2.704 },
      50: { 0.90: 1.676, 0.95: 2.009, 0.99: 2.678 },
      60: { 0.90: 1.671, 0.95: 2.000, 0.99: 2.660 },
      100: { 0.90: 1.660, 0.95: 1.984, 0.99: 2.626 },
      1000: { 0.90: 1.646, 0.95: 1.962, 0.99: 2.581 },
      10000: { 0.90: 1.645, 0.95: 1.960, 0.99: 2.576 }
  };
  
  // 查找最接近的自由度
  let closestDf = df;
  while (!(closestDf in tTable) && closestDf > 1) {
    closestDf--;
  }
  
  // 如果找不到精确的自由度，使用最大的可用自由度
  if (!(closestDf in tTable)) {
    closestDf = Math.max(...Object.keys(tTable).map(Number));
  }
  
  // 返回对应的t临界值，如果置信水平不存在则使用0.95
  const dfEntry = tTable[closestDf];
  return dfEntry[confidenceLevel] || dfEntry[0.95] || 1.96; // 默认95%置信水平
};

// 计算t分布临界值（通用函数）
export function getTCriticalValue(confidenceLevel: number, degreesOfFreedom: number): number {
  return getApproximateTCriticalValue(degreesOfFreedom, confidenceLevel);
}

// 计算z分布临界值（通用函数）
export function getZCriticalValue(confidenceLevel: number): number {
  // 常用置信水平的z临界值（双侧检验）
  const zTable: Record<number, number> = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.576
  };
  
  return zTable[confidenceLevel] || 1.96; // 默认95%
}

// 计算样本标准差（使用样本方差，n-1自由度）
export function calculateStdDev(data: number[]): number {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  const mean = calculateMean(data);
  const sumSquaredDiffs = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  const sampleVariance = sumSquaredDiffs / (data.length - 1);
  return Math.sqrt(sampleVariance);
}

// 计算两样本合并方差（假设方差相等）
export function calculatePooledVariance(data1: number[], data2: number[]): number {
  const n1 = data1.length;
  const n2 = data2.length;
  const var1 = data1.reduce((sum, val) => sum + Math.pow(val - calculateMean(data1), 2), 0) / (n1 - 1);
  const var2 = data2.reduce((sum, val) => sum + Math.pow(val - calculateMean(data2), 2), 0) / (n2 - 1);
  
  return ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
}

// 计算配对数据的差值
export function calculateDifferences(before: number[], after: number[]): number[] {
  if (before.length !== after.length) {
    throw new Error('前后样本长度必须相同');
  }
  return before.map((val, index) => after[index] - val);
}

// 单样本均值置信区间
export function calculateOneSampleMeanCI(
  data: number[], 
  confidenceLevel: number,
  knownVariance?: number
): {
  mean: number;
  standardError: number;
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
  method: string;
} {
  const n = data.length;
  const mean = calculateMean(data);
  let standardError: number;
  let marginOfError: number;
  let method: string;
  
  if (knownVariance !== undefined) {
    // 使用z检验（已知方差）
    standardError = Math.sqrt(knownVariance) / Math.sqrt(n);
    const zCritical = getZCriticalValue(confidenceLevel);
    marginOfError = zCritical * standardError;
    method = 'z检验（已知方差）';
  } else {
    // 使用t检验（未知方差）
    const stdDev = calculateStdDev(data);
    standardError = stdDev / Math.sqrt(n);
    const degreesOfFreedom = n - 1;
    const tCritical = getTCriticalValue(confidenceLevel, degreesOfFreedom);
    marginOfError = tCritical * standardError;
    method = 't检验（未知方差）';
  }
  
  return {
    mean,
    standardError,
    marginOfError,
    lowerBound: mean - marginOfError,
    upperBound: mean + marginOfError,
    method
  };
}

// 两样本均值之差置信区间
export function calculateTwoSampleMeanCI(
  data1: number[],
  data2: number[],
  confidenceLevel: number,
  assumeEqualVariances: boolean = false
): {
  meanDifference: number;
  standardError: number;
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
  method: string;
  degreesOfFreedom: number;
} {
  const n1 = data1.length;
  const n2 = data2.length;
  const mean1 = calculateMean(data1);
  const mean2 = calculateMean(data2);
  const meanDifference = mean1 - mean2;
  
  let standardError: number;
  let degreesOfFreedom: number;
  
  if (assumeEqualVariances) {
    // 假设方差相等
    const pooledVariance = calculatePooledVariance(data1, data2);
    standardError = Math.sqrt(pooledVariance * (1/n1 + 1/n2));
    degreesOfFreedom = n1 + n2 - 2;
  } else {
    // 不假设方差相等（Welch-Satterthwaite）
    const var1 = data1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) / (n1 - 1);
    const var2 = data2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0) / (n2 - 1);
    standardError = Math.sqrt(var1/n1 + var2/n2);
    
    // 计算Welch-Satterthwaite自由度
    const dfNumerator = Math.pow(var1/n1 + var2/n2, 2);
    const dfDenominator = Math.pow(var1, 2)/(Math.pow(n1, 2)*(n1-1)) + Math.pow(var2, 2)/(Math.pow(n2, 2)*(n2-1));
    degreesOfFreedom = dfNumerator / dfDenominator;
  }
  
  const tCritical = getTCriticalValue(confidenceLevel, Math.round(degreesOfFreedom));
  const marginOfError = tCritical * standardError;
  
  return {
    meanDifference,
    standardError,
    marginOfError,
    lowerBound: meanDifference - marginOfError,
    upperBound: meanDifference + marginOfError,
    method: assumeEqualVariances ? '合并方差t检验' : 'Welch-Satterthwaite t检验',
    degreesOfFreedom
  };
}

// 配对样本均值之差置信区间
export function calculatePairedMeanCI(
  before: number[],
  after: number[],
  confidenceLevel: number
): {
  meanDifference: number;
  standardError: number;
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
  method: string;
} {
  const differences = calculateDifferences(before, after);
  const n = differences.length;
  const meanDifference = calculateMean(differences);
  const stdDevDifference = calculateStdDev(differences);
  const standardError = stdDevDifference / Math.sqrt(n);
  
  const degreesOfFreedom = n - 1;
  const tCritical = getTCriticalValue(confidenceLevel, degreesOfFreedom);
  const marginOfError = tCritical * standardError;
  
  return {
    meanDifference,
    standardError,
    marginOfError,
    lowerBound: meanDifference - marginOfError,
    upperBound: meanDifference + marginOfError,
    method: '配对t检验'
  };
}

// 单比例置信区间函数在下方已定义，此处为了兼容旧代码保留引用

// 两比例之差置信区间函数在下方已定义，此处为了兼容旧代码保留引用

/**
 * 误差函数的逆函数近似
 * @param x 输入值，范围[-1,1]
 * @returns 逆误差函数值
 */
const inverseErrorFunction = (x: number): number => {
  // 误差函数逆函数的近似计算
  // 这里使用泰勒展开的近似方法
  const a = 0.140012;
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  
  if (absX >= 1) {
    return sign * Infinity;
  }
  
  const logTerm = Math.log(1 - absX * absX);
  const sqrtTerm = Math.sqrt(-logTerm - 2 * Math.log(2) - a * logTerm);
  
  return sign * sqrtTerm;
};

/**
 * 计算描述性统计量
 */
export const calculateDescriptiveStats = (data: number[], confidenceLevel: number = 0.95, options?: {
  isNormal?: boolean;
  knownVariance?: boolean;
}): {
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  std: number;
  skewness: number;
  kurtosis: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  count: number;
  confidenceInterval: { 
    lower: number; 
    upper: number; 
    marginOfError: number;
    method: string;
    criticalValue: number;
  };
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
    skewness: calculateSkewness(data),
    kurtosis: calculateKurtosis(data),
    min: sortedData[0],
    max: sortedData[n - 1],
    range: sortedData[n - 1] - sortedData[0],
    ...calculateQuartiles(data),
    count: n,
    confidenceInterval: calculateConfidenceInterval(data, confidenceLevel, options || { isNormal: false, knownVariance: false }),
  };
};

/**
 * 计算单个比例的置信区间
 * 支持两种方法：
 * 1. Wald区间（正态近似法）
 * 2. Wilson得分区间（更准确的小样本方法）
 * 
 * @param successes 成功次数
 * @param trials 试验总次数
 * @param confidenceLevel 置信水平，默认为0.95（95%）
 * @param options 可选参数
 * @param options.method 方法：'wald'（正态近似）或 'wilson'（Wilson得分区间）
 * @returns 包含置信区间下限、上限、边际误差和使用的方法的对象
 */
export const calculateProportionConfidenceInterval = (successes: number, trials: number, confidenceLevel: number = 0.95, options: {
  method?: 'wald' | 'wilson';
} = {}): {
  lower: number;
  upper: number;
  marginOfError: number;
  method: string;
  criticalValue: number;
  proportion: number;
} => {
  if (trials <= 0) {
    throw new Error('试验总次数必须大于0');
  }
  if (successes < 0 || successes > trials) {
    throw new Error('成功次数必须在0到试验总次数之间');
  }
  if (confidenceLevel <= 0 || confidenceLevel >= 1) {
    throw new Error('置信水平必须在0到1之间');
  }
  
  const { method = 'wald' } = options;
  const proportion = successes / trials;
  
  // 计算临界值（z值）
  let criticalValue: number;
  switch (confidenceLevel) {
    case 0.90:
      criticalValue = 1.645;
      break;
    case 0.95:
      criticalValue = 1.96;
      break;
    case 0.99:
      criticalValue = 2.576;
      break;
    default:
      // 对于其他置信水平，使用误差函数的逆函数近似计算z值
      const alpha = 1 - confidenceLevel;
      const zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha/2) - 1);
      criticalValue = Math.abs(zApprox);
  }
  
  let lower: number;
  let upper: number;
  let methodName: string;
  
  if (method === 'wilson') {
    // Wilson得分区间
    const n = trials;
    const z = criticalValue;
    const zSquared = z * z;
    
    const pTilde = (successes + zSquared / 2) / (n + zSquared);
    const denominator = n + zSquared;
    const numerator = z * Math.sqrt((proportion * (1 - proportion) * n + zSquared / 4) / n);
    
    lower = pTilde - numerator / denominator;
    upper = pTilde + numerator / denominator;
    methodName = 'Wilson得分区间';
  } else {
    // Wald区间（正态近似）
    const standardError = Math.sqrt((proportion * (1 - proportion)) / trials);
    const marginOfError = criticalValue * standardError;
    
    lower = proportion - marginOfError;
    upper = proportion + marginOfError;
    methodName = 'Wald区间（正态近似）';
  }
  
  // 确保结果在[0, 1]范围内
  lower = Math.max(0, lower);
  upper = Math.min(1, upper);
  const marginOfError = (upper - lower) / 2;
  
  return {
    lower,
    upper,
    marginOfError,
    method: methodName,
    criticalValue,
    proportion
  };
};

/**
 * 计算两个比例之差的置信区间
 * 支持两种方法：
 * 1. 正态近似法（Wald区间）
 * 2. 连续性修正法
 * 
 * @param successes1 第一个样本的成功次数
 * @param trials1 第一个样本的试验总次数
 * @param successes2 第二个样本的成功次数
 * @param trials2 第二个样本的试验总次数
 * @param confidenceLevel 置信水平，默认为0.95（95%）
 * @param options 可选参数
 * @param options.method 方法：'wald'（正态近似）或 'continuity'（连续性修正）
 * @returns 包含置信区间下限、上限、边际误差和使用的方法的对象
 */
export const calculateTwoProportionConfidenceInterval = (successes1: number, trials1: number, successes2: number, trials2: number, confidenceLevel: number = 0.95, options: {
  method?: 'wald' | 'continuity';
} = {}): {
  lower: number;
  upper: number;
  marginOfError: number;
  method: string;
  criticalValue: number;
  proportionDiff: number;
  proportion1: number;
  proportion2: number;
} => {
  // 参数验证
  if (trials1 <= 0 || trials2 <= 0) {
    throw new Error('试验总次数必须大于0');
  }
  if (successes1 < 0 || successes1 > trials1 || successes2 < 0 || successes2 > trials2) {
    throw new Error('成功次数必须在0到试验总次数之间');
  }
  if (confidenceLevel <= 0 || confidenceLevel >= 1) {
    throw new Error('置信水平必须在0到1之间');
  }
  
  const { method = 'wald' } = options;
  
  // 计算样本比例
  const proportion1 = successes1 / trials1;
  const proportion2 = successes2 / trials2;
  const proportionDiff = proportion1 - proportion2;
  
  // 计算临界值（z值）
  let criticalValue: number;
  switch (confidenceLevel) {
    case 0.90:
      criticalValue = 1.645;
      break;
    case 0.95:
      criticalValue = 1.96;
      break;
    case 0.99:
      criticalValue = 2.576;
      break;
    default:
      const alpha = 1 - confidenceLevel;
      const zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha/2) - 1);
      criticalValue = Math.abs(zApprox);
  }
  
  let lower: number;
  let upper: number;
  let methodName: string;
  
  if (method === 'continuity') {
    // 连续性修正法
    const p1 = (successes1 + 0.5) / trials1;
    const p2 = (successes2 + 0.5) / trials2;
    const pDiff = p1 - p2;
    
    const standardError = Math.sqrt((p1 * (1 - p1)) / trials1 + (p2 * (1 - p2)) / trials2);
    const marginOfError = criticalValue * standardError;
    
    lower = pDiff - marginOfError;
    upper = pDiff + marginOfError;
    methodName = '连续性修正法';
  } else {
    // Wald区间（正态近似）
    const standardError = Math.sqrt((proportion1 * (1 - proportion1)) / trials1 + (proportion2 * (1 - proportion2)) / trials2);
    const marginOfError = criticalValue * standardError;
    
    lower = proportionDiff - marginOfError;
    upper = proportionDiff + marginOfError;
    methodName = 'Wald区间（正态近似）';
  }
  
  // 确保结果在[-1, 1]范围内
  lower = Math.max(-1, lower);
  upper = Math.min(1, upper);
  const marginOfError = (upper - lower) / 2;
  
  return {
    lower,
    upper,
    marginOfError,
    method: methodName,
    criticalValue,
    proportionDiff,
    proportion1,
    proportion2
  };
};

/**
 * 计算两个均值之差的置信区间
 * 支持三种情况：
 * 1. 两独立样本，方差相等（Pooled t-interval）
 * 2. 两独立样本，方差不等（Welch's t-interval）
 * 3. 配对样本（Paired t-interval）
 * 
 * @param data1 第一个样本数据
 * @param data2 第二个样本数据
 * @param confidenceLevel 置信水平，默认为0.95（95%）
 * @param options 可选参数
 * @param options.method 方法：'pooled'（方差相等）、'welch'（方差不等）、'paired'（配对样本）
 * @param options.isNormal 是否假设正态分布，默认为true
 * @returns 包含置信区间下限、上限、边际误差和使用的方法的对象
 */
export const calculateTwoSampleConfidenceInterval = (data1: number[], data2: number[], confidenceLevel: number = 0.95, options: {
  method?: 'pooled' | 'welch' | 'paired';
  isNormal?: boolean;
} = {}): {
  lower: number;
  upper: number;
  marginOfError: number;
  method: string;
  criticalValue: number;
  meanDiff: number;
} => {
  if (!data1 || !data2 || data1.length === 0 || data2.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  const { method = 'welch' } = options;
  const n1 = data1.length;
  const n2 = data2.length;
  
  // 计算样本均值和标准差
  const mean1 = calculateMean(data1);
  const mean2 = calculateMean(data2);
  const meanDiff = mean1 - mean2;
  
  let criticalValue: number;
  let standardError: number;
  let methodName: string;
  
  if (method === 'paired') {
    // 配对样本t检验
    if (n1 !== n2) {
      throw new Error('配对样本的数据长度必须相同');
    }
    
    // 计算差值
    const differences = data1.map((x, i) => x - data2[i]);
    const stdDiff = calculateStd(differences);
    
    // 标准误
    standardError = stdDiff / Math.sqrt(n1);
    
    // 临界值
    criticalValue = getApproximateTCriticalValue(n1 - 1, confidenceLevel);
    methodName = '配对样本t检验';
  } else if (method === 'pooled') {
    // Pooled t-interval（方差相等假设）
    const var1 = calculateVariance(data1);
    const var2 = calculateVariance(data2);
    
    // 合并方差
    const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    
    // 标准误
    standardError = Math.sqrt(pooledVar * (1/n1 + 1/n2));
    
    // 临界值
    criticalValue = getApproximateTCriticalValue(n1 + n2 - 2, confidenceLevel);
    methodName = '合并方差t检验';
  } else {
    // Welch's t-interval（方差不等）
    const var1 = calculateVariance(data1);
    const var2 = calculateVariance(data2);
    
    // 标准误
    standardError = Math.sqrt(var1/n1 + var2/n2);
    
    // 计算自由度（Welch-Satterthwaite公式）
    const numerator = Math.pow(var1/n1 + var2/n2, 2);
    const denominator = Math.pow(var1, 2)/(Math.pow(n1, 2)*(n1 - 1)) + Math.pow(var2, 2)/(Math.pow(n2, 2)*(n2 - 1));
    const df = Math.floor(numerator / denominator);
    
    // 临界值
    criticalValue = getApproximateTCriticalValue(df, confidenceLevel);
    methodName = 'Welch t检验';
  }
  
  // 计算边际误差
  const marginOfError = criticalValue * standardError;
  
  // 计算置信区间
  const lower = meanDiff - marginOfError;
  const upper = meanDiff + marginOfError;
  
  return { 
    lower, 
    upper, 
    marginOfError, 
    method: methodName,
    criticalValue,
    meanDiff
  };
};

/**
 * 生成直方图数据
 */
/**
 * 计算均值的所需样本量
 * @param confidenceLevel 置信水平
 * @param marginOfError 边际误差（置信区间的一半宽度）
 * @param options 可选参数
 * @param options.populationStd 总体标准差（已知时）
 * @param options.estimatedStd 估计的标准差（方差未知时）
 * @param options.useTDistribution 是否使用t分布（小样本时更准确）
 * @returns 所需的最小样本量
 */
export const calculateSampleSizeForMean = (
  confidenceLevel: number,
  marginOfError: number,
  options?: {
    populationStd?: number;
    estimatedStd?: number;
    useTDistribution?: boolean;
  }
): number => {
  if (marginOfError <= 0) {
    throw new Error('边际误差必须大于0');
  }
  
  const { populationStd, estimatedStd, useTDistribution = false } = options || {};
  
  // 检查是否提供了标准差信息
  if (populationStd === undefined && estimatedStd === undefined) {
    throw new Error('当方差未知时，必须提供估计的标准差');
  }
  
  // 使用提供的标准差，如果总体标准差未知则使用估计值
  const std = populationStd !== undefined ? populationStd : estimatedStd!;
  
  // 计算临界值（z值）
  let criticalValue: number;
  switch (confidenceLevel) {
    case 0.90:
      criticalValue = 1.645;
      break;
    case 0.95:
      criticalValue = 1.96;
      break;
    case 0.99:
      criticalValue = 2.576;
      break;
    default:
      const alpha = 1 - confidenceLevel;
      const zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha/2) - 1);
      criticalValue = Math.abs(zApprox);
  }
  
  // 初步计算样本量（使用z分布）
  let n = Math.pow((criticalValue * std) / marginOfError, 2);
  
  // 如果使用t分布，需要进行迭代调整
  if (useTDistribution && std === estimatedStd) {
    let previousN = 0;
    // 迭代直到收敛
    while (Math.abs(n - previousN) > 0.5) {
      previousN = n;
      // 使用近似的自由度（n-1）计算t临界值
      const df = Math.max(1, Math.floor(n) - 1);
      const tCriticalValue = getApproximateTCriticalValue(df, confidenceLevel);
      n = Math.pow((tCriticalValue * std) / marginOfError, 2);
    }
  }
  
  // 向上取整到最近的整数
  return Math.ceil(n);
};

/**
 * 计算比例的所需样本量
 * @param confidenceLevel 置信水平
 * @param marginOfError 边际误差（置信区间的一半宽度）
 * @param options 可选参数
 * @param options.estimatedProportion 估计的比例（已知时）
 * @param options.useConservativeEstimate 是否使用保守估计（p=0.5时方差最大）
 * @returns 所需的最小样本量
 */
export const calculateSampleSizeForProportion = (
  confidenceLevel: number,
  marginOfError: number,
  options?: {
    estimatedProportion?: number;
    useConservativeEstimate?: boolean;
  }
): number => {
  if (marginOfError <= 0) {
    throw new Error('边际误差必须大于0');
  }
  
  const { estimatedProportion, useConservativeEstimate = false } = options || {};
  
  // 使用提供的比例估计值，如果未提供且不使用保守估计，则抛出错误
  if (estimatedProportion === undefined && !useConservativeEstimate) {
    throw new Error('当不使用保守估计时，必须提供估计的比例');
  }
  
  // 如果使用保守估计，使用p=0.5（此时方差最大）
  const p = useConservativeEstimate ? 0.5 : estimatedProportion!;
  
  // 确保比例在有效范围内
  if (p < 0 || p > 1) {
    throw new Error('估计的比例必须在0到1之间');
  }
  
  // 计算临界值（z值）
  let criticalValue: number;
  switch (confidenceLevel) {
    case 0.90:
      criticalValue = 1.645;
      break;
    case 0.95:
      criticalValue = 1.96;
      break;
    case 0.99:
      criticalValue = 2.576;
      break;
    default:
      const alpha = 1 - confidenceLevel;
      const zApprox = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha/2) - 1);
      criticalValue = Math.abs(zApprox);
  }
  
  // 计算样本量
  const n = Math.pow(criticalValue, 2) * p * (1 - p) / Math.pow(marginOfError, 2);
  
  // 向上取整到最近的整数
  return Math.ceil(n);
};

/**
 * 误差函数的实现
 * @param x 输入值
 * @returns 误差函数值
 */
const erf = (x: number): number => {
  // 误差函数的近似实现
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  
  // 使用近似公式
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  
  return sign * y;
};

/**
 * 计算正态分布的累积分布函数值
 */
const normalCDF = (x: number): number => {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
};

/**
 * 计算t分布的累积分布函数值的近似实现
 */
const tCDF = (x: number, df: number): number => {
  // 使用近似算法计算t分布CDF
  // 对于大自由度，使用正态分布近似
  if (df >= 30) {
    return normalCDF(x);
  }
  
  // 使用简化的近似方法
  // 基于t分布与正态分布的关系进行近似
  const absX = Math.abs(x);
  const zValue = normalCDF(absX);
  
  // 对小自由度进行修正
  const correction = 1 / (4 * df) - 7 / (96 * df * df) + 127 / (9216 * df * df * df);
  
  let pApprox;
  if (x < 0) {
    pApprox = 1 - zValue + correction * (absX * absX + 1) * (zValue - 0.5);
  } else {
    pApprox = zValue + correction * (absX * absX + 1) * (0.5 - zValue);
  }
  
  // 确保结果在[0,1]范围内
  return Math.min(1, Math.max(0, pApprox));
};

/**
 * 计算t分布的p值
 * @param tValue t统计量的值
 * @param df 自由度
 * @param tail 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns p值
 */
export const calculateTTestPValue = (tValue: number, df: number, tail: 'two' | 'left' | 'right'): number => {
  try {
    if (tail === 'two') {
      return 2 * Math.min(tCDF(tValue, df), 1 - tCDF(tValue, df));
    } else if (tail === 'left') {
      return tCDF(tValue, df);
    } else { // right
      return 1 - tCDF(tValue, df);
    }
  } catch (error) {
    // 如果mathjs计算失败，使用正态分布近似
    console.warn('t分布计算失败，使用正态分布近似');
    if (tail === 'two') {
      return 2 * (1 - normalCDF(Math.abs(tValue)));
    } else if (tail === 'left') {
      return normalCDF(tValue);
    } else { // right
      return 1 - normalCDF(tValue);
    }
  }
};

/**
 * 执行单样本均值的Z检验（方差已知）
 * @param data 样本数据
 * @param mu0 原假设的均值
 * @param sigma 总体标准差
 * @param alpha 显著性水平
 * @param testType 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns 检验结果
 */
export const performZTest = (
  data: number[],
  mu0: number,
  sigma: number,
  alpha: number = 0.05,
  testType: 'two' | 'left' | 'right' = 'two'
): {
  testType: 'Z-test';
  mean: number;
  zValue: number;
  pValue: number;
  criticalValue: number;
  rejected: boolean;
  confidenceInterval: { lower: number; upper: number } | null;
  method: string;
} => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  const n = data.length;
  const mean = calculateMean(data);
  const standardError = sigma / Math.sqrt(n);
  const zValue = (mean - mu0) / standardError;
  
  // 计算p值
  let pValue: number;
  if (testType === 'left') {
    pValue = normalCDF(zValue);
  } else if (testType === 'right') {
    pValue = 1 - normalCDF(zValue);
  } else {
    pValue = 2 * (1 - normalCDF(Math.abs(zValue)));
  }
  
  // 计算临界值
  let criticalValue: number;
  if (testType === 'left') {
    criticalValue = -Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha) - 1);
  } else if (testType === 'right') {
    criticalValue = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha) - 1);
  } else {
    criticalValue = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha/2) - 1);
  }
  
  // 判断是否拒绝原假设
  let rejected: boolean;
  if (testType === 'left') {
    rejected = zValue <= criticalValue;
  } else if (testType === 'right') {
    rejected = zValue >= criticalValue;
  } else {
    rejected = Math.abs(zValue) >= criticalValue;
  }
  
  // 计算置信区间
  let confidenceInterval: { lower: number; upper: number } | null = null;
  const zCritical = Math.sqrt(2) * inverseErrorFunction(2 * (1 - alpha/2) - 1);
  
  if (testType === 'two') {
    confidenceInterval = {
      lower: mean - zCritical * standardError,
      upper: mean + zCritical * standardError
    };
  } else if (testType === 'left') {
    confidenceInterval = {
      lower: -Infinity,
      upper: mean + zCritical * standardError
    };
  } else if (testType === 'right') {
    confidenceInterval = {
      lower: mean - zCritical * standardError,
      upper: Infinity
    };
  }
  
  return {
    testType: 'Z-test',
    mean,
    zValue,
    pValue,
    criticalValue,
    rejected,
    confidenceInterval,
    method: `Z检验（方差已知，${testType === 'two' ? '双侧' : testType === 'left' ? '左侧' : '右侧'}检验）`
  };
};

/**
 * 执行单样本均值的t检验（方差未知）
 * @param data 样本数据
 * @param mu0 原假设的均值
 * @param alpha 显著性水平
 * @param testType 检验类型: 'two' (双侧), 'left' (左侧), 'right' (右侧)
 * @returns 检验结果
 */
export const performTTest = (
  data: number[],
  mu0: number,
  alpha: number = 0.05,
  testType: 'two' | 'left' | 'right' = 'two'
): {
  testType: 't-test';
  mean: number;
  std: number;
  tValue: number;
  df: number;
  pValue: number;
  criticalValue: number;
  rejected: boolean;
  confidenceInterval: { lower: number; upper: number } | null;
  method: string;
} => {
  if (!data || data.length === 0) {
    throw new Error('数据数组不能为空');
  }
  
  const n = data.length;
  const mean = calculateMean(data);
  const std = calculateStd(data);
  const standardError = std / Math.sqrt(n);
  const df = n - 1;
  const tValue = (mean - mu0) / standardError;
  
  // 计算p值
  const pValue = calculateTTestPValue(tValue, df, testType);
  
  // 计算临界值
  let criticalValue: number;
  if (testType === 'left') {
    criticalValue = -getApproximateTCriticalValue(df, 1 - alpha);
  } else if (testType === 'right') {
    criticalValue = getApproximateTCriticalValue(df, 1 - alpha);
  } else {
    criticalValue = getApproximateTCriticalValue(df, 1 - alpha/2);
  }
  
  // 判断是否拒绝原假设
  let rejected: boolean;
  if (testType === 'left') {
    rejected = tValue <= criticalValue;
  } else if (testType === 'right') {
    rejected = tValue >= criticalValue;
  } else {
    rejected = Math.abs(tValue) >= criticalValue;
  }
  
  // 计算置信区间
  let confidenceInterval: { lower: number; upper: number } | null = null;
  const tCritical = getApproximateTCriticalValue(df, 1 - alpha/2);
  
  if (testType === 'two') {
    confidenceInterval = {
      lower: mean - tCritical * standardError,
      upper: mean + tCritical * standardError
    };
  } else if (testType === 'left') {
    confidenceInterval = {
      lower: -Infinity,
      upper: mean + tCritical * standardError
    };
  } else if (testType === 'right') {
    confidenceInterval = {
      lower: mean - tCritical * standardError,
      upper: Infinity
    };
  }
  
  return {
    testType: 't-test',
    mean,
    std,
    tValue,
    df,
    pValue,
    criticalValue,
    rejected,
    confidenceInterval,
    method: `t检验（方差未知，${testType === 'two' ? '双侧' : testType === 'left' ? '左侧' : '右侧'}检验）`
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