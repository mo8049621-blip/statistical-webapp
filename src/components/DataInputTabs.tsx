import React, { useState } from 'react';
import FileUploader from './FileUploader';
import DistributionGenerator from './DistributionGenerator';
import AIDataGenerator from './AIDataGenerator';
import './DataInputTabs.css';
import type { DataInputType } from '../types/data';

interface DataInputTabsProps {
  // 可以添加任何需要的props
}

const DataInputTabs: React.FC<DataInputTabsProps> = () => {
  const [activeTab, setActiveTab] = useState<DataInputType>('file');

  const handleTabChange = (tab: DataInputType) => {
    setActiveTab(tab);
  };

  return (
    <div className="data-input-tabs">
      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 'file' ? 'active' : ''}`}
          onClick={() => handleTabChange('file')}
        >
          文件上传
        </button>
        <button
          className={`tab-button ${activeTab === 'distribution' ? 'active' : ''}`}
          onClick={() => handleTabChange('distribution')}
        >
          分布生成
        </button>
        <button
          className={`tab-button ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => handleTabChange('ai')}
        >
          AI生成数据
        </button>
      </div>
      
      <div className="tabs-content">
        {activeTab === 'file' && <FileUploader />}
        {activeTab === 'distribution' && <DistributionGenerator />}
        {activeTab === 'ai' && <AIDataGenerator />}
      </div>
    </div>
  );
};

export default DataInputTabs;