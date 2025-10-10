import React, { useState } from 'react';
import { useDataContext } from '../contexts/DataContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, ScatterChart, Scatter, Cell
} from 'recharts';
import './BasicStatistics.css';

interface BasicStatisticsProps {
  // 可以添加任何需要的props
}

const BasicStatistics: React.FC<BasicStatisticsProps> = () => {
  const { currentDataset, statistics } = useDataContext();
  const [chartType, setChartType] = useState<'histogram' | 'line' | 'scatter' | 'area'>('histogram');
  const [binCount, setBinCount] = useState<number>(20);

  if (!currentDataset || !statistics) {
    return (
      <div className="basic-statistics">
        <p>正在计算统计信息...</p>
      </div>
    );
  }

  // 生成直方图数据
  const generateHistogramData = () => {
    const min = statistics.min;
    const max = statistics.max;
    const binWidth = (max - min) / binCount;
    const bins = new Array(binCount).fill(0).map((_, i) => ({
      bin: `${(min + i * binWidth).toFixed(2)} - ${(min + (i + 1) * binWidth).toFixed(2)}`,
      count: 0,
      start: min + i * binWidth,
      end: min + (i + 1) * binWidth
    }));

    currentDataset.data.forEach(value => {
      const binIndex = Math.floor((value - min) / binWidth);
      if (binIndex >= 0 && binIndex < binCount) {
        bins[binIndex].count++;
      }
    });

    return bins;
  };

  // 生成折线图数据（排序后的值）
  const generateLineData = () => {
    const sortedData = [...currentDataset.data].sort((a, b) => a - b);
    return sortedData.map((value, index) => ({
      index,
      value
    }));
  };

  // 生成散点图数据
  const generateScatterData = () => {
    return currentDataset.data.map((value, index) => ({
      x: index,
      y: value
    }));
  };

  // 渲染图表
  const renderChart = () => {
    switch (chartType) {
      case 'histogram':
        const histogramData = generateHistogramData();
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bin" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: '频次', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`频次: ${value}`, '计数']} />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="频次" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        const lineData = generateLineData();
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" label={{ value: '索引', position: 'insideBottomRight', offset: -10 }} />
              <YAxis label={{ value: '值', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`值: ${value}`, '数据点']} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        const scatterData = generateScatterData();
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="索引" label={{ value: '索引', position: 'insideBottomRight', offset: -10 }} />
              <YAxis dataKey="y" name="值" label={{ value: '值', angle: -90, position: 'insideLeft' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="数据点" data={scatterData}>
                {scatterData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`rgba(136, 132, 216, ${0.3 + (index / scatterData.length) * 0.7})`} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'area':
        const areaData = generateLineData();
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" label={{ value: '索引', position: 'insideBottomRight', offset: -10 }} />
              <YAxis label={{ value: '值', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`值: ${value}`, '数据点']} />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="basic-statistics">
      <h3>基本统计分析</h3>
      
      <div className="statistics-grid">
        <div className="stat-card">
          <h4>均值</h4>
          <p className="stat-value">{statistics.mean.toFixed(4)}</p>
        </div>
        <div className="stat-card">
          <h4>中位数</h4>
          <p className="stat-value">{statistics.median.toFixed(4)}</p>
        </div>
        <div className="stat-card">
          <h4>标准差</h4>
          <p className="stat-value">{statistics.stdDev.toFixed(4)}</p>
        </div>
        <div className="stat-card">
          <h4>方差</h4>
          <p className="stat-value">{statistics.variance.toFixed(4)}</p>
        </div>
        <div className="stat-card">
          <h4>最小值</h4>
          <p className="stat-value">{statistics.min.toFixed(4)}</p>
        </div>
        <div className="stat-card">
          <h4>最大值</h4>
          <p className="stat-value">{statistics.max.toFixed(4)}</p>
        </div>
        <div className="stat-card">
          <h4>第一四分位数</h4>
          <p className="stat-value">{statistics.q1.toFixed(4)}</p>
        </div>
        <div className="stat-card">
          <h4>第三四分位数</h4>
          <p className="stat-value">{statistics.q3.toFixed(4)}</p>
        </div>
        <div className="stat-card">
          <h4>偏度</h4>
          <p className={`stat-value ${Math.abs(statistics.skewness) > 1 ? 'highlight' : ''}`}>
            {statistics.skewness.toFixed(4)}
          </p>
          <p className="stat-description">
            {statistics.skewness > 1 ? '高度右偏' : 
             statistics.skewness < -1 ? '高度左偏' : 
             Math.abs(statistics.skewness) > 0.5 ? '中等偏斜' : '近似对称'}
          </p>
        </div>
        <div className="stat-card">
          <h4>峰度</h4>
          <p className={`stat-value ${Math.abs(statistics.kurtosis) > 1 ? 'highlight' : ''}`}>
            {statistics.kurtosis.toFixed(4)}
          </p>
          <p className="stat-description">
            {statistics.kurtosis > 1 ? '高尖峰' : 
             statistics.kurtosis < -1 ? '低平峰' : '中等峰度'}
          </p>
        </div>
      </div>
      
      <div className="visualization-section">
        <h4>数据可视化</h4>
        <div className="chart-controls">
          <div className="chart-type-selector">
            <label>
              <input
                type="radio"
                name="chartType"
                value="histogram"
                checked={chartType === 'histogram'}
                onChange={(e) => setChartType(e.target.value as any)}
              />
              直方图
            </label>
            <label>
              <input
                type="radio"
                name="chartType"
                value="line"
                checked={chartType === 'line'}
                onChange={(e) => setChartType(e.target.value as any)}
              />
              折线图
            </label>
            <label>
              <input
                type="radio"
                name="chartType"
                value="scatter"
                checked={chartType === 'scatter'}
                onChange={(e) => setChartType(e.target.value as any)}
              />
              散点图
            </label>
            <label>
              <input
                type="radio"
                name="chartType"
                value="area"
                checked={chartType === 'area'}
                onChange={(e) => setChartType(e.target.value as any)}
              />
              面积图
            </label>
          </div>
          
          {chartType === 'histogram' && (
            <div className="bin-control">
              <label htmlFor="binCount">直方图分组数: {binCount}</label>
              <input
                type="range"
                id="binCount"
                min="5"
                max="50"
                step="1"
                value={binCount}
                onChange={(e) => setBinCount(parseInt(e.target.value))}
              />
              <input
                type="number"
                min="5"
                max="50"
                step="1"
                value={binCount}
                onChange={(e) => setBinCount(parseInt(e.target.value))}
              />
            </div>
          )}
        </div>
        
        <div className="chart-container">
          {renderChart()}
        </div>
      </div>
      
      <div className="summary-section">
        <h4>统计摘要</h4>
        <div className="summary-content">
          <p>
            数据集包含 {statistics.count} 个数据点，分布范围从 {statistics.min.toFixed(2)} 到 {statistics.max.toFixed(2)}，
            平均值为 {statistics.mean.toFixed(2)}。数据的标准差为 {statistics.stdDev.toFixed(2)}，表明
            {statistics.stdDev > statistics.mean * 0.5 ? '数据分布较为分散' : '数据分布相对集中'}。
          </p>
          <p>
            偏度为 {statistics.skewness.toFixed(2)}，表明数据分布{statistics.skewness > 0 ? '向右偏斜' : statistics.skewness < 0 ? '向左偏斜' : '大致对称'}。
            峰度为 {statistics.kurtosis.toFixed(2)}，表明数据分布{statistics.kurtosis > 0 ? '比正态分布更尖' : statistics.kurtosis < 0 ? '比正态分布更平' : '接近正态分布'}。
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicStatistics;