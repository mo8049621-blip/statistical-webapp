import type { StatisticsResult, DistributionParams, DistributionType, EstimationResult } from '../types/data';

// 计算基本统计量
export const calculateStatistics = (data: number[]): StatisticsResult => {
  if (!data || data.length === 0) {
    throw new Error('数据不能为空');
  }

  const sortedData = [...data].sort((a, b) => a - b);
  const count = sortedData.length;
  
  // 计算均值
  const sum = sortedData.reduce((acc, val) => acc + val, 0);
  const mean = sum / count;
  
  // 计算方差和标准差
  const variance = sortedData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
  const stdDev = Math.sqrt(variance);
  
  // 计算中位数
  let median;
  if (count % 2 === 0) {
    median = (sortedData[count / 2 - 1] + sortedData[count / 2]) / 2;
  } else {
    median = sortedData[Math.floor(count / 2)];
  }
  
  // 计算四分位数
  const q1 = sortedData[Math.floor(count * 0.25)];
  const q3 = sortedData[Math.floor(count * 0.75)];
  
  // 计算偏度
  const skewnessNumerator = sortedData.reduce((acc, val) => acc + Math.pow(val - mean, 3), 0) / count;
  const skewness = skewnessNumerator / Math.pow(stdDev, 3);
  
  // 计算峰度
  const kurtosisNumerator = sortedData.reduce((acc, val) => acc + Math.pow(val - mean, 4), 0) / count;
  const kurtosis = kurtosisNumerator / Math.pow(stdDev, 4) - 3; // 超额峰度
  
  return {
    mean,
    variance,
    stdDev,
    median,
    min: sortedData[0],
    max: sortedData[count - 1],
    q1,
    q3,
    skewness,
    kurtosis,
    count
  };
};

// 计算阶乘的辅助函数
export const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

// 生成分布数据
export const generateDistributionData = (
  type: DistributionType,
  params: DistributionParams,
  sampleSize: number = 1000
): number[] => {
  const data: number[] = [];
  
  switch (type) {
    case 'normal': {
      const { mean = 0, stdDev = 1 } = params;
      // 正态分布采样（使用Box-Muller变换）
      while (data.length < sampleSize) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        data.push(mean + z1 * stdDev);
        if (data.length < sampleSize) {
          data.push(mean + z2 * stdDev);
        }
      }
      break;
    }
    
    case 'binomial': {
      const { trials = 10, probability = 0.5 } = params;
      // 二项分布采样
      for (let i = 0; i < sampleSize; i++) {
        let successes = 0;
        for (let j = 0; j < trials; j++) {
          if (Math.random() < probability) {
            successes++;
          }
        }
        data.push(successes);
      }
      break;
    }
    
    case 'poisson': {
      const { lambda = 5 } = params;
      // 泊松分布采样（使用Knuth算法）
      for (let i = 0; i < sampleSize; i++) {
        let k = 0;
        let p = 1;
        do {
          k++;
          p *= Math.random();
        } while (p > Math.exp(-lambda));
        data.push(k - 1);
      }
      break;
    }
    
    default:
      throw new Error(`不支持的分布类型: ${type}`);
  }
  
  return data;
};

// 执行MLE和MoM估计
export const performEstimation = (
  data: number[],
  distribution: DistributionType
): EstimationResult => {
  const result: EstimationResult = {
    distribution,
    mleParams: {},
    momParams: {},
    confidenceIntervals: {}
  };
  
  const stats = calculateStatistics(data);
  const n = data.length;
  
  switch (distribution) {
    case 'normal': {
      // 正态分布的MLE和MoM估计相同
      const mleMean = stats.mean;
      const mleStdDev = stats.stdDev;
      
      // 均值的95%置信区间
      const meanCI = [
        mleMean - 1.96 * mleStdDev / Math.sqrt(n),
        mleMean + 1.96 * mleStdDev / Math.sqrt(n)
      ];
      
      result.mleParams = { mean: mleMean, stdDev: mleStdDev };
      result.momParams = { mean: mleMean, stdDev: mleStdDev };
      result.confidenceIntervals = {
        mean: meanCI as [number, number],
        stdDev: [
          mleStdDev * Math.sqrt((n - 1) / 127.62), // χ²(999, 0.975) ≈ 127.62
          mleStdDev * Math.sqrt((n - 1) / 743.97)  // χ²(999, 0.025) ≈ 743.97
        ] as [number, number]
      };
      break;
    }
    
    case 'binomial': {
      // 二项分布的MLE和MoM估计
      const mleProbability = stats.mean / 10; // 假设试验次数为10
      const momProbability = mleProbability;
      
      // 概率的95%置信区间（Wald区间）
      const probabilitySE = Math.sqrt(mleProbability * (1 - mleProbability) / (n * 10));
      const probabilityCI = [
        Math.max(0, mleProbability - 1.96 * probabilitySE),
        Math.min(1, mleProbability + 1.96 * probabilitySE)
      ];
      
      result.mleParams = { probability: mleProbability, trials: 10 };
      result.momParams = { probability: momProbability, trials: 10 };
      result.confidenceIntervals = { probability: probabilityCI as [number, number] };
      break;
    }
    
    case 'poisson': {
      // 泊松分布的MLE和MoM估计
      const mleLambda = stats.mean;
      const momLambda = mleLambda;
      
      // λ的95%置信区间（Wald区间）
      const lambdaSE = Math.sqrt(mleLambda / n);
      const lambdaCI = [
        Math.max(0, mleLambda - 1.96 * lambdaSE),
        mleLambda + 1.96 * lambdaSE
      ];
      
      result.mleParams = { lambda: mleLambda };
      result.momParams = { lambda: momLambda };
      result.confidenceIntervals = { lambda: lambdaCI as [number, number] };
      break;
    }
  }
  
  return result;
};

// 解析CSV文件数据
export const parseCSV = (fileContent: string): number[] => {
  const lines = fileContent.trim().split('\n');
  const data: number[] = [];
  
  for (const line of lines) {
    const values = line.split(',').map(val => val.trim());
    for (const value of values) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        data.push(num);
      }
    }
  }
  
  return data;
};

// 模拟AI生成数据
import { callDashScopeAPI } from './aiApi';
import { AI_CONFIG } from '../config/aiConfig';

/**
 * 从AI生成数据
 * @param prompt 用户的自然语言提示
 * @param useRealAPI 是否使用真实的AI API (可选，默认使用配置文件中的设置)
 * @param apiKey AI API密钥
 * @returns 生成的数据数组
 */
export const generateAIData = async (prompt: string, useRealAPI: boolean = AI_CONFIG.USE_REAL_AI_API, apiKey: string = ''): Promise<number[]> => {
  console.log(`生成AI数据的提示: ${prompt}`);
  
  // 如果配置使用真实API且提供了API密钥
  if (useRealAPI && apiKey) {
    try {
      if (AI_CONFIG.DEBUG_MODE) {
        console.log('使用真实的DashScope API生成数据...');
        console.log(`调用参数: 模型=${AI_CONFIG.MODEL_NAME}, 超时=${AI_CONFIG.API_TIMEOUT}ms`);
      }
      return await callDashScopeAPI(prompt, apiKey);
    } catch (error) {
      console.error('调用真实API失败，回退到模拟数据:', error);
      // API调用失败时回退到模拟数据
    }
  }
  
  // 模拟实现（默认行为或API调用失败时回退）
  if (AI_CONFIG.DEBUG_MODE) {
    console.log('使用模拟数据生成...');
  }
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 生成一些随机数据作为示例
  const sampleSize = Math.floor(Math.random() * 500) + 500; // 500-1000个数据点
  
  // 基于提示内容生成不同类型的数据
  if (prompt.toLowerCase().includes('normal') || prompt.toLowerCase().includes('正态')) {
    return generateDistributionData('normal', { mean: 0, stdDev: 1 }, sampleSize);
  } else if (prompt.toLowerCase().includes('binomial') || prompt.toLowerCase().includes('二项')) {
    return generateDistributionData('binomial', { trials: 10, probability: 0.5 }, sampleSize);
  } else if (prompt.toLowerCase().includes('poisson') || prompt.toLowerCase().includes('泊松')) {
    return generateDistributionData('poisson', { lambda: 5 }, sampleSize);
  } else {
    // 默认生成正态分布数据
    return generateDistributionData('normal', { mean: 50, stdDev: 10 }, sampleSize);
  }
};