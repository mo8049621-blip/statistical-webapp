import React, { useState, useEffect } from 'react';
import { useDataContext } from '../contexts/DataContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DistributionType } from '../types/data';
import './MLEMoMAnalysis.css';

interface MLEMoMAnalysisProps {
  // 可以添加任何需要的props
}

const MLEMoMAnalysis: React.FC<MLEMoMAnalysisProps> = () => {
  const { currentDataset, estimationResult } = useDataContext();
  const [selectedDistribution, setSelectedDistribution] = useState<DistributionType>('normal');
  const [showFitComparison, setShowFitComparison] = useState<boolean>(true);

  // 组件挂载时，如果没有估计结果，使用默认的正态分布估计
  useEffect(() => {
    if (currentDataset && !estimationResult) {
      // 这里不需要额外操作，因为DataContext中已经在currentDataset变化时执行估计
    }
  }, [currentDataset, estimationResult]);
    
  if (!currentDataset || !estimationResult) {
    return (
      <div className="mle-mom-analysis">
        <p>正在计算参数估计...</p>
      </div>
    );
  }

  // 生成拟合曲线数据
  const generateFitData = () => {
    const min = Math.min(...currentDataset.data);
    const max = Math.max(...currentDataset.data);
    const range = max - min;
    const padding = range * 0.1;
    const start = min - padding;
    const end = max + padding;
    const points = 100;
    const step = (end - start) / points;
    
    const data = [];
    for (let i = 0; i <= points; i++) {
      const x = start + i * step;
      let mleProb = 0;
      let momProb = 0;

      // 根据不同分布类型计算概率密度
      switch (selectedDistribution) {
        case 'normal':
          if (estimationResult.mleParams && estimationResult.momParams) {
            const { mean: mleMean, stdDev: mleStdDev } = estimationResult.mleParams;
            const { mean: momMean, stdDev: momStdDev } = estimationResult.momParams;
            
            mleProb = (1 / (mleStdDev * Math.sqrt(2 * Math.PI))) * 
                     Math.exp(-Math.pow(x - mleMean, 2) / (2 * Math.pow(mleStdDev, 2)));
            
            momProb = (1 / (momStdDev * Math.sqrt(2 * Math.PI))) * 
                     Math.exp(-Math.pow(x - momMean, 2) / (2 * Math.pow(momStdDev, 2)));
          }
          break;
        case 'binomial':
          if (estimationResult.mleParams && estimationResult.momParams) {
            const { n: mleN, p: mleP } = estimationResult.mleParams;
            const { n: momN, p: momP } = estimationResult.momParams;
            
            // 二项分布质量函数
            const binomialPMF = (k: number, n: number, p: number) => {
              if (k < 0 || k > n) return 0;
              // 简化的二项式系数计算
              let logCoeff = 0;
              for (let i = 1; i <= k; i++) {
                logCoeff += Math.log((n - k + i) / i);
              }
              return Math.exp(logCoeff + k * Math.log(p) + (n - k) * Math.log(1 - p));
            };
            
            mleProb = binomialPMF(Math.round(x), mleN, mleP);
            momProb = binomialPMF(Math.round(x), momN, momP);
          }
          break;
        case 'poisson':
          if (estimationResult.mleParams && estimationResult.momParams) {
            const { lambda: mleLambda } = estimationResult.mleParams;
            const { lambda: momLambda } = estimationResult.momParams;
            
            // 泊松分布质量函数
            const poissonPMF = (k: number, lambda: number) => {
              if (k < 0) return 0;
              return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
            };
            
            mleProb = poissonPMF(Math.round(x), mleLambda);
            momProb = poissonPMF(Math.round(x), momLambda);
          }
          break;
      }

      data.push({
        x,
        'MLE拟合': mleProb,
        'MoM拟合': momProb
      });
    }

    return data;
  };

  // 阶乘辅助函数
  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // 计算拟合优度指标
  const calculateGoodnessOfFit = () => {
    // 这里可以实现卡方检验、K-S检验等拟合优度指标
    // 为简化，我们计算估计参数的差异百分比
    const goodness = {
      parameters: [] as { name: string; mle: number; mom: number; diffPercent: number }[]
    };

    switch (selectedDistribution) {
      case 'normal':
        if (estimationResult.mleParams && estimationResult.momParams) {
          const { mean: mleMean, stdDev: mleStdDev } = estimationResult.mleParams;
          const { mean: momMean, stdDev: momStdDev } = estimationResult.momParams;
          
          goodness.parameters.push({
            name: '均值',
            mle: mleMean,
            mom: momMean,
            diffPercent: Math.abs((mleMean - momMean) / ((mleMean + momMean) / 2) * 100)
          });
          goodness.parameters.push({
            name: '标准差',
            mle: mleStdDev,
            mom: momStdDev,
            diffPercent: Math.abs((mleStdDev - momStdDev) / ((mleStdDev + momStdDev) / 2) * 100)
          });
        }
        break;
      case 'binomial':
        if (estimationResult.mleParams && estimationResult.momParams) {
          const { n: mleN, p: mleP } = estimationResult.mleParams;
          const { n: momN, p: momP } = estimationResult.momParams;
          
          goodness.parameters.push({
            name: '试验次数n',
            mle: mleN,
            mom: momN,
            diffPercent: Math.abs((mleN - momN) / ((mleN + momN) / 2) * 100)
          });
          goodness.parameters.push({
            name: '成功概率p',
            mle: mleP,
            mom: momP,
            diffPercent: Math.abs((mleP - momP) / ((mleP + momP) / 2) * 100)
          });
        }
        break;
      case 'poisson':
        if (estimationResult.mleParams && estimationResult.momParams) {
          const { lambda: mleLambda } = estimationResult.mleParams;
          const { lambda: momLambda } = estimationResult.momParams;
          
          goodness.parameters.push({
            name: 'λ参数',
            mle: mleLambda,
            mom: momLambda,
            diffPercent: Math.abs((mleLambda - momLambda) / ((mleLambda + momLambda) / 2) * 100)
          });
        }
        break;
    }

    return goodness;
  };

  const goodnessOfFit = calculateGoodnessOfFit();
  const fitData = generateFitData();

  return (
    <div className="mle-mom-analysis">
      <h3>MLE/MoM 参数估计分析</h3>
      
      <div className="distribution-selection">
        <label htmlFor="distributionType">选择分布类型:</label>
        <select
          id="distributionType"
          value={selectedDistribution}
          onChange={(e) => setSelectedDistribution(e.target.value as DistributionType)}
        >
          <option value="normal">正态分布</option>
          <option value="binomial">二项分布</option>
          <option value="poisson">泊松分布</option>
        </select>
      </div>
      
      <div className="estimation-results">
        <h4>参数估计结果</h4>
          
          <div className="estimates-grid">
            <div className="estimates-panel mle-panel">
              <h5>最大似然估计 (MLE)</h5>
              <div className="estimates-content">
                {selectedDistribution === 'normal' && estimationResult.mleParams && (
                  <>
                    <p>均值 (μ): <span className="estimate-value">{estimationResult.mleParams.mean.toFixed(4)}</span></p>
                    <p>标准差 (σ): <span className="estimate-value">{estimationResult.mleParams.stdDev.toFixed(4)}</span></p>
                  </>
                )}
                
                {selectedDistribution === 'binomial' && estimationResult.mleParams && (
                  <>
                    <p>试验次数 (n): <span className="estimate-value">{estimationResult.mleParams.n.toFixed(0)}</span></p>
                    <p>成功概率 (p): <span className="estimate-value">{estimationResult.mleParams.p.toFixed(4)}</span></p>
                  </>
                )}
                
                {selectedDistribution === 'poisson' && estimationResult.mleParams && (
                  <>
                    <p>λ 参数: <span className="estimate-value">{estimationResult.mleParams.lambda.toFixed(4)}</span></p>
                  </>
                )}
              </div>
            </div>
            
            <div className="estimates-panel mom-panel">
              <h5>矩估计 (MoM)</h5>
              <div className="estimates-content">
                {selectedDistribution === 'normal' && estimationResult.momParams && (
                  <>
                    <p>均值 (μ): <span className="estimate-value">{estimationResult.momParams.mean.toFixed(4)}</span></p>
                    <p>标准差 (σ): <span className="estimate-value">{estimationResult.momParams.stdDev.toFixed(4)}</span></p>
                  </>
                )}
                
                {selectedDistribution === 'binomial' && estimationResult.momParams && (
                  <>
                    <p>试验次数 (n): <span className="estimate-value">{estimationResult.momParams.n.toFixed(0)}</span></p>
                    <p>成功概率 (p): <span className="estimate-value">{estimationResult.momParams.p.toFixed(4)}</span></p>
                  </>
                )}
                
                {selectedDistribution === 'poisson' && estimationResult.momParams && (
                  <>
                    <p>λ 参数: <span className="estimate-value">{estimationResult.momParams.lambda.toFixed(4)}</span></p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {goodnessOfFit && (
            <div className="goodness-of-fit">
              <h4>拟合优度比较</h4>
              <div className="goodness-table">
                <table>
                  <thead>
                    <tr>
                      <th>参数</th>
                      <th>MLE 估计值</th>
                      <th>MoM 估计值</th>
                      <th>差异百分比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goodnessOfFit.parameters.map((param, index) => (
                      <tr key={index}>
                        <td>{param.name}</td>
                        <td>{param.mle.toFixed(4)}</td>
                        <td>{param.mom.toFixed(4)}</td>
                        <td className={param.diffPercent > 5 ? 'significant-diff' : ''}>
                          {param.diffPercent.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
      
      <div className="visualization-section">
        <div className="visualization-controls">
          <label>
            <input
              type="checkbox"
              checked={showFitComparison}
              onChange={(e) => setShowFitComparison(e.target.checked)}
            />
            显示拟合曲线比较
          </label>
        </div>
        
        {showFitComparison && fitData.length > 0 && (
          <div className="chart-container">
            <h4>拟合曲线对比</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={fitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" label={{ value: '值', position: 'insideBottomRight', offset: -10 }} />
                <YAxis label={{ value: '概率密度', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [typeof value === 'number' ? value.toFixed(6) : String(value), '概率密度']} />
                <Legend />
                <Line type="monotone" dataKey="MLE拟合" stroke="#8884d8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="MoM拟合" stroke="#82ca9d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      <div className="analysis-summary">
        <h4>分析总结</h4>
        <div className="summary-content">
          <p>
            对于{selectedDistribution === 'normal' ? '正态分布' : selectedDistribution === 'binomial' ? '二项分布' : '泊松分布'}，
            MLE和MoM方法得出的参数估计{goodnessOfFit && goodnessOfFit.parameters.some(p => p.diffPercent > 5) ? '存在显著差异' : '基本一致'}。
          </p>
          {selectedDistribution === 'normal' && (
            <p>
              正态分布的MLE和MoM估计在理论上是一致的，对于均值的估计完全相同，
              对于标准差的估计差异也很小，这与概率论中的理论结果相符。
            </p>
          )}
          {selectedDistribution === 'binomial' && (
            <p>
              二项分布的参数估计较为复杂，尤其是当试验次数n未知时。
              在这种情况下，MLE通常能提供更准确的估计，但计算过程可能更耗时。
            </p>
          )}
          {selectedDistribution === 'poisson' && (
            <p>
              泊松分布的λ参数的MLE和MoM估计在理论上也是一致的，都等于样本均值，
              这表明当数据服从泊松分布时，两种估计方法将给出相同的结果。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MLEMoMAnalysis;