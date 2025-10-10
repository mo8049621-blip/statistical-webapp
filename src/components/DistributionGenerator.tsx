import React, { useState } from 'react';
import { useDataContext } from '../contexts/DataContext';
import type { DistributionType, DistributionParams } from '../types/data';
import './DistributionGenerator.css';

interface DistributionGeneratorProps {
  // 可以添加任何需要的props
}

const DistributionGenerator: React.FC<DistributionGeneratorProps> = () => {
  const { generateFromDistribution, error } = useDataContext();
  const [distributionType, setDistributionType] = useState<DistributionType>('normal');
  const [params, setParams] = useState<DistributionParams>({
    mean: 0,
    stdDev: 1,
    trials: 10,
    probability: 0.5,
    lambda: 5,
    sampleSize: 1000
  });

  const handleParamChange = (paramName: keyof DistributionParams, value: number) => {
    setParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleGenerate = () => {
    generateFromDistribution(distributionType, params, params.sampleSize || 1000);
  };

  const renderParamControls = () => {
    switch (distributionType) {
      case 'normal':
        return (
          <>
            <div className="param-control">
              <label htmlFor="mean">均值 (μ): {params.mean}</label>
              <input
                type="range"
                id="mean"
                min="-10"
                max="10"
                step="0.1"
                value={params.mean || 0}
                onChange={(e) => handleParamChange('mean', parseFloat(e.target.value))}
              />
              <input
                type="number"
                min="-10"
                max="10"
                step="0.1"
                value={params.mean || 0}
                onChange={(e) => handleParamChange('mean', parseFloat(e.target.value))}
              />
            </div>
            <div className="param-control">
              <label htmlFor="stdDev">标准差 (σ): {params.stdDev}</label>
              <input
                type="range"
                id="stdDev"
                min="0.1"
                max="5"
                step="0.1"
                value={params.stdDev || 1}
                onChange={(e) => handleParamChange('stdDev', parseFloat(e.target.value))}
              />
              <input
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                value={params.stdDev || 1}
                onChange={(e) => handleParamChange('stdDev', parseFloat(e.target.value))}
              />
            </div>
          </>
        );
      
      case 'binomial':
        return (
          <>
            <div className="param-control">
              <label htmlFor="trials">试验次数 (n): {params.trials}</label>
              <input
                type="range"
                id="trials"
                min="1"
                max="100"
                step="1"
                value={params.trials || 10}
                onChange={(e) => handleParamChange('trials', parseInt(e.target.value))}
              />
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                value={params.trials || 10}
                onChange={(e) => handleParamChange('trials', parseInt(e.target.value))}
              />
            </div>
            <div className="param-control">
              <label htmlFor="probability">成功概率 (p): {params.probability}</label>
              <input
                type="range"
                id="probability"
                min="0"
                max="1"
                step="0.01"
                value={params.probability || 0.5}
                onChange={(e) => handleParamChange('probability', parseFloat(e.target.value))}
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={params.probability || 0.5}
                onChange={(e) => handleParamChange('probability', parseFloat(e.target.value))}
              />
            </div>
          </>
        );
      
      case 'poisson':
        return (
          <div className="param-control">
            <label htmlFor="lambda">λ 参数: {params.lambda}</label>
            <input
              type="range"
              id="lambda"
              min="0.1"
              max="20"
              step="0.1"
              value={params.lambda || 5}
              onChange={(e) => handleParamChange('lambda', parseFloat(e.target.value))}
            />
            <input
              type="number"
              min="0.1"
              max="20"
              step="0.1"
              value={params.lambda || 5}
              onChange={(e) => handleParamChange('lambda', parseFloat(e.target.value))}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="distribution-generator">
      <h3>分布生成</h3>
      <p>选择概率分布类型并配置参数来生成数据</p>
      
      <div className="distribution-type-selector">
        <label>
          <input
            type="radio"
            name="distribution"
            value="normal"
            checked={distributionType === 'normal'}
            onChange={(e) => setDistributionType(e.target.value as DistributionType)}
          />
          正态分布
        </label>
        <label>
          <input
            type="radio"
            name="distribution"
            value="binomial"
            checked={distributionType === 'binomial'}
            onChange={(e) => setDistributionType(e.target.value as DistributionType)}
          />
          二项分布
        </label>
        <label>
          <input
            type="radio"
            name="distribution"
            value="poisson"
            checked={distributionType === 'poisson'}
            onChange={(e) => setDistributionType(e.target.value as DistributionType)}
          />
          泊松分布
        </label>
      </div>
      
      <div className="param-controls">
        {renderParamControls()}
        
        <div className="param-control">
          <label htmlFor="sampleSize">样本大小: {params.sampleSize}</label>
          <input
            type="range"
            id="sampleSize"
            min="100"
            max="10000"
            step="100"
            value={params.sampleSize || 1000}
            onChange={(e) => handleParamChange('sampleSize', parseInt(e.target.value))}
          />
          <input
            type="number"
            min="100"
            max="10000"
            step="100"
            value={params.sampleSize || 1000}
            onChange={(e) => handleParamChange('sampleSize', parseInt(e.target.value))}
          />
        </div>
      </div>
      
      <button 
        className="generate-button"
        onClick={handleGenerate}
      >
        生成数据
      </button>
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      
      <div className="distribution-info">
        <h4>分布说明:</h4>
        {distributionType === 'normal' && (
          <p>正态分布（高斯分布）是一种连续概率分布，由均值（μ）和标准差（σ）参数化。它在自然科学、社会科学等领域有广泛应用。</p>
        )}
        {distributionType === 'binomial' && (
          <p>二项分布是一种离散概率分布，描述了在n次独立伯努利试验中成功k次的概率，其中每次试验的成功概率为p。</p>
        )}
        {distributionType === 'poisson' && (
          <p>泊松分布是一种离散概率分布，用于描述在固定时间或空间内发生事件的次数，λ表示单位时间内的平均事件数。</p>
        )}
      </div>
    </div>
  );
};

export default DistributionGenerator;