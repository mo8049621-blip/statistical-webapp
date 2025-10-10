import React from 'react';
import './App.css';
import { DataProvider } from './contexts/DataContext';
import DataInputTabs from './components/DataInputTabs';
import AnalysisTabs from './components/AnalysisTabs';

const App: React.FC = () => {
  return (
    <DataProvider>
      <div className="app">
        <header className="app-header">
          <h1>综合数据分析平台</h1>
          <p>支持文件上传、分布生成和AI数据生成的数据分析工具</p>
        </header>
        
        <main className="app-main">
          {/* 数据输入区域 */}
          <section className="input-section">
            <h2>数据输入</h2>
            <DataInputTabs />
          </section>
          
          {/* 数据分析区域 */}
          <section className="analysis-section">
            <h2>数据分析</h2>
            <AnalysisTabs />
          </section>
        </main>
        
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} 综合数据分析平台 - 提供专业的统计分析和参数估计功能</p>
        </footer>
      </div>
    </DataProvider>
  );
};

export default App;