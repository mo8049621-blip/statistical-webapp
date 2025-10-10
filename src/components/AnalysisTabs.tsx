import React from 'react';
import BasicStatistics from './BasicStatistics';
import MLEMoMAnalysis from './MLEMoMAnalysis';
import { useDataContext } from '../contexts/DataContext';
import './AnalysisTabs.css';

interface AnalysisTabsProps {
  // 可以添加任何需要的props
}

const AnalysisTabs: React.FC<AnalysisTabsProps> = () => {
  const { selectedTab, setSelectedTab, currentDataset } = useDataContext();

  const handleTabChange = (tab: 'basic' | 'estimation') => {
    setSelectedTab(tab);
  };

  if (!currentDataset) {
    return (
      <div className="analysis-tabs">
        <div className="no-data-message">
          <h3>请先选择或生成数据集</h3>
          <p>您需要先上传文件、生成分布数据或使用AI生成数据，然后才能进行分析。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-tabs">
      <div className="tabs-container">
        <div className="tabs">
        <button
          className={`tab-button ${selectedTab === 'basic' ? 'active' : ''}`}
          onClick={() => handleTabChange('basic')}
        >
          基本统计
        </button>
        <button
          className={`tab-button ${selectedTab === 'estimation' ? 'active' : ''}`}
          onClick={() => handleTabChange('estimation')}
        >
          MLE/MoM估计
        </button>
        </div>
      </div>
      
      <div className="tab-content">
        {selectedTab === 'basic' && <BasicStatistics />}
        {selectedTab === 'estimation' && <MLEMoMAnalysis />}
      </div>
      
      <div className="dataset-info">
        <h4>当前数据集信息</h4>
        <div className="dataset-details">
          <div className="dataset-detail-item">
            <span className="dataset-detail-label">名称</span>
            <span className="dataset-detail-value">{currentDataset.name}</span>
          </div>
          <div className="dataset-detail-item">
            <span className="dataset-detail-label">类型</span>
            <span className="dataset-detail-value">
              {currentDataset.type === 'file' ? '文件上传' : 
               currentDataset.type === 'distribution' ? '分布生成' : 'AI生成'}
            </span>
          </div>
          <div className="dataset-detail-item">
            <span className="dataset-detail-label">数据点数量</span>
            <span className="dataset-detail-value">{currentDataset.data.length}</span>
          </div>
          <div className="dataset-detail-item">
            <span className="dataset-detail-label">创建时间</span>
            <span className="dataset-detail-value">{currentDataset.createdAt.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTabs;