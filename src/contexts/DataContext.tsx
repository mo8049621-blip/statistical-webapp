import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { DataSet, DistributionType, DistributionParams, StatisticsResult, EstimationResult } from '../types/data';
import { calculateStatistics, generateDistributionData, performEstimation, parseCSV, generateAIData } from '../utils/statistics';
import { AI_CONFIG, validateAIConfig } from '../config/aiConfig';
import { getDashScopeApiKey } from '../utils/envUtils';

// 定义上下文类型
interface DataContextType {
  datasets: DataSet[];
  currentDataset: DataSet | null;
  selectedTab: 'basic' | 'estimation';
  addDataset: (dataset: Omit<DataSet, 'id' | 'createdAt'>) => void;
  setCurrentDataset: (datasetId: string | null) => void;
  setSelectedTab: (tab: 'basic' | 'estimation') => void;
  statistics: StatisticsResult | null;
  estimationResult: EstimationResult | null;
  loadFromFile: (file: File) => Promise<void>;
  generateFromDistribution: (type: DistributionType, params: DistributionParams, sampleSize: number) => void;
  generateFromAI: (prompt: string, userApiKey?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// 创建上下文
const DataContext = createContext<DataContextType | undefined>(undefined);

// 上下文提供者组件
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [datasets, setDatasets] = useState<DataSet[]>([]);
  const [currentDataset, setCurrentDataset] = useState<DataSet | null>(null);
  const [selectedTab, setSelectedTab] = useState<'basic' | 'estimation'>('basic');
  const [statistics, setStatistics] = useState<StatisticsResult | null>(null);
  const [estimationResult, setEstimationResult] = useState<EstimationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 当选择当前数据集时，计算统计量和估计结果
  useEffect(() => {
    if (currentDataset) {
      try {
        const stats = calculateStatistics(currentDataset.data);
        setStatistics(stats);
        
        // 默认使用正态分布进行参数估计
        const estimation = performEstimation(currentDataset.data, 'normal');
        setEstimationResult(estimation);
      } catch (err) {
        setError(err instanceof Error ? err.message : '计算统计量时出错');
      }
    } else {
      setStatistics(null);
      setEstimationResult(null);
    }
  }, [currentDataset]);

  // 添加数据集
  const addDataset = (dataset: Omit<DataSet, 'id' | 'createdAt'>) => {
    const newDataset: DataSet = {
      ...dataset,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setDatasets(prev => [...prev, newDataset]);
    setCurrentDataset(newDataset);
    setError(null);
  };

  // 从文件加载数据
  const loadFromFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fileContent = await file.text();
      const data = parseCSV(fileContent);
      
      if (data.length === 0) {
        throw new Error('文件中没有有效的数值数据');
      }
      
      addDataset({
        name: file.name,
        type: 'file',
        source: file.name,
        data,
        metadata: {
          fileSize: file.size,
          fileType: file.type
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载文件时出错');
    } finally {
      setIsLoading(false);
    }
  };

  // 从分布生成数据
  const generateFromDistribution = (type: DistributionType, params: DistributionParams, sampleSize: number) => {
    try {
      const data = generateDistributionData(type, params, sampleSize);
      
      addDataset({
        name: `${type}分布数据`,
        type: 'distribution',
        source: type,
        data,
        metadata: {
          distributionType: type,
          params,
          sampleSize
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成分布数据时出错');
    }
  };

  // 从AI生成数据
  // userApiKey参数可选，如果提供则优先使用用户输入的API密钥
  const generateFromAI = async (prompt: string, userApiKey: string = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 验证AI配置
      const configValidation = validateAIConfig();
      if (!configValidation.isValid) {
        throw new Error(configValidation.message || 'AI配置无效');
      }
      
      // 从环境变量中获取API密钥
      const envApiKey = getDashScopeApiKey();
      // 优先使用用户输入的API密钥，如果用户没有输入，则使用环境变量中的密钥
      const apiKey = userApiKey || envApiKey;
      
      // 决定是否使用真实API
      // 1. 配置文件中启用了真实API
      // 2. 提供了API密钥
      const useRealAPI = AI_CONFIG.USE_REAL_AI_API && !!apiKey;
      
      if (AI_CONFIG.DEBUG_MODE) {
        console.log(`用户${userApiKey ? '提供了' : '未提供'}API密钥，${useRealAPI ? '将使用真实API' : '将使用模拟数据'}`);
      }
      
      if (useRealAPI && AI_CONFIG.DEBUG_MODE) {
        console.log('将使用真实的AI API生成数据');
      }
      
      // 调用generateAIData函数，传递参数
      const data = await generateAIData(prompt, useRealAPI, apiKey);
      
      // 添加数据集时，记录是否使用了真实API和配置信息
      addDataset({
        name: useRealAPI ? '真实AI生成数据' : '模拟AI生成数据',
        type: 'ai',
        source: prompt,
        data,
        metadata: {
          prompt,
          useRealAPI,
          hasApiKey: !!apiKey,
          config: {
            model: AI_CONFIG.MODEL_NAME,
            timeout: AI_CONFIG.API_TIMEOUT
          }
        }
      });
    } catch (err) {
        // 提供更友好的错误信息
        let errorMessage = '';
        if (err instanceof Error) {
          // 检查常见的错误类型
          if (err.message.includes('API密钥无效')) {
            errorMessage = 'API密钥无效或已过期，请检查您的API密钥设置。';
          } else if (err.message.includes('超时')) {
            errorMessage = `API调用超时，请检查网络连接或稍后再试。`;
          } else if (err.message.includes('调用过于频繁')) {
            errorMessage = 'API调用过于频繁，请稍后再试。';
          } else {
            errorMessage = `生成AI数据时出错: ${err.message}`;
          }
        } else {
          errorMessage = '生成AI数据时出错，请稍后再试。';
        }
        
        setError(errorMessage);
        console.error('生成AI数据时出错:', err);
      } finally {
        setIsLoading(false);
      }
  };

  // 设置当前数据集
  const setCurrentDatasetById = (datasetId: string | null) => {
    if (datasetId === null) {
      setCurrentDataset(null);
    } else {
      const dataset = datasets.find(ds => ds.id === datasetId);
      setCurrentDataset(dataset || null);
    }
  };

  const value: DataContextType = {
    datasets,
    currentDataset,
    selectedTab,
    addDataset,
    setCurrentDataset: setCurrentDatasetById,
    setSelectedTab,
    statistics,
    estimationResult,
    loadFromFile,
    generateFromDistribution,
    generateFromAI,
    isLoading,
    error
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// 自定义钩子，用于使用数据上下文
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext必须在DataProvider内部使用');
  }
  return context;
};