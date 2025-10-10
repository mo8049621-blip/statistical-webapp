import React, { useState } from 'react';
import { useDataContext } from '../contexts/DataContext';
import './AIDataGenerator.css';

interface AIDataGeneratorProps {
  // 可以添加任何需要的props
}

const AIDataGenerator: React.FC<AIDataGeneratorProps> = () => {
  const { generateFromAI, isLoading, error } = useDataContext();
  const [prompt, setPrompt] = useState<string>(
    '生成1000个服从正态分布的随机数，均值为10，标准差为2'
  );
  const [apiKey, setApiKey] = useState<string>('');
  const [samplePrompts] = useState<string[]>([
    '生成1000个服从正态分布的随机数，均值为10，标准差为2',
    '生成800个服从二项分布的数据，试验次数为20，成功概率为0.3',
    '生成500个服从泊松分布的随机数，λ参数为3',
    '生成一组包含1200个数据点的学生成绩分布，平均分75，标准差10',
    '生成1500个服从均匀分布的随机数，范围在0到100之间'
  ]);

  const handleGenerate = () => {
    if (prompt.trim()) {
      generateFromAI(prompt, apiKey);
    }
  };

  const handleUseSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt);
  };

  return (
    <div className="ai-data-generator">
      <h3>AI生成数据</h3>
      <p>通过自然语言描述，让AI为您生成符合要求的数据</p>
      
      <div className="prompt-input-section">
        <label htmlFor="ai-prompt">数据描述：</label>
        <textarea
          id="ai-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例如：生成1000个服从正态分布的随机数，均值为0，标准差为1"
          rows={4}
        />
        
        <div className="api-key-section">
          <label htmlFor="api-key">DashScope API密钥（可选）：</label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          />
          <p className="api-key-hint">如果留空，将使用环境变量中配置的API密钥</p>
        </div>
        
        <div className="sample-prompts">
          <h4>示例提示：</h4>
          <div className="sample-prompts-list">
            {samplePrompts.map((samplePrompt, index) => (
              <button
                key={index}
                className="sample-prompt-button"
                onClick={() => handleUseSamplePrompt(samplePrompt)}
                title={samplePrompt}
              >
                {samplePrompt.length > 30 ? `${samplePrompt.substring(0, 30)}...` : samplePrompt}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          className="generate-button"
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <span>正在生成数据...</span>
            </div>
          ) : (
            '生成数据'
          )}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      
      <div className="ai-generation-tips">
        <h4>提示技巧:</h4>
        <ul>
          <li>明确说明您需要的数据分布类型（正态、二项、泊松等）</li>
          <li>指定参数值，如均值、标准差、概率等</li>
          <li>说明所需的数据点数量</li>
          <li>可以描述实际场景，如"学生成绩分布"、"股票收益率"等</li>
          <li>越具体的描述越能得到符合预期的结果</li>
        </ul>
      </div>
      
      <div className="ai-disclaimer">
        <p><strong>提示：</strong>要使用真实的DashScope API，请输入您的API密钥。如果API调用失败，系统将自动回退到模拟数据生成模式。</p>
      </div>
    </div>
  );
};

export default AIDataGenerator;