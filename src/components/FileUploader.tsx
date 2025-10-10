import React from 'react';
import { useDataContext } from '../contexts/DataContext';
import './FileUploader.css';

interface FileUploaderProps {
  // 可以添加任何需要的props
}

const FileUploader: React.FC<FileUploaderProps> = () => {
  const { loadFromFile, isLoading, error } = useDataContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadFromFile(file);
      // 重置input，允许重复上传同一个文件
      event.target.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      loadFromFile(file);
    }
  };

  return (
    <div className="file-uploader">
      <h3>文件上传</h3>
      <p>上传CSV或其他包含数值数据的文件进行分析</p>
      
      <div 
        className="drop-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          accept=".csv,.txt,.xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input" className="upload-label">
          {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <span>正在处理文件...</span>
            </div>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <p>点击或拖放文件到此处</p>
              <p className="file-types">支持的文件类型: CSV, TXT, Excel</p>
            </>
          )}
        </label>
      </div>
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      
      <div className="file-upload-tips">
        <h4>使用提示:</h4>
        <ul>
          <li>CSV文件应包含数值数据，每行一个值或逗号分隔的值</li>
          <li>对于Excel文件，系统将尝试解析所有工作表中的数值</li>
          <li>文件大小建议不超过10MB，以确保良好的性能</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploader;