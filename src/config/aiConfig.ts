/**
 * AI API配置
 * 
 * 这个文件包含了控制AI数据生成功能的配置选项
 * 
 * 配置说明：
 * - USE_REAL_AI_API: 设置为true启用真实的AI API调用，设置为false使用模拟数据
 * - API_TIMEOUT: API调用的超时时间（毫秒）
 * 
 * 如何配置API密钥：
 * 1. 在项目根目录的.env文件中设置VITE_DASHSCOPE_API_KEY环境变量
 * 2. 格式：VITE_DASHSCOPE_API_KEY=your_api_key_here
 * 3. 确保只有最后一个VITE_DASHSCOPE_API_KEY定义生效（删除重复的定义）
 * 
 * 获取API密钥的方法：
 * 1. 访问 https://dashscope.console.aliyun.com/
 * 2. 注册或登录阿里云账号
 * 3. 开通通义千问服务
 * 4. 在API密钥管理页面生成新的API密钥
 */

import { getDashScopeApiKey } from '../utils/envUtils';

export const AI_CONFIG = {
  // 是否使用真实的AI API，设置为true启用真实API调用，false使用模拟数据
  USE_REAL_AI_API: true,
  
  // API调用的超时时间（毫秒）
  API_TIMEOUT: 30000,
  
  // API基础URL
  API_BASE_URL: 'https://dashscope.aliyuncs.com',
  
  // 模型选择
  MODEL_NAME: 'qwen-plus',
  
  // 调试模式 - 设置为true可以在控制台查看详细的API调用日志
  DEBUG_MODE: true
};

/**
 * 验证API配置是否正确
 * @returns 配置是否有效
 */
export const validateAIConfig = (): { isValid: boolean; message?: string } => {
  // 导入环境变量工具函数
  
  // 检查API密钥是否存在
  const apiKey = getDashScopeApiKey();
  
  if (AI_CONFIG.USE_REAL_AI_API && !apiKey) {
    return {
      isValid: false,
      message: '未配置API密钥。请在.env文件中设置VITE_DASHSCOPE_API_KEY环境变量。'
    };
  }
  
  if (apiKey && apiKey.length < 10) {
    return {
      isValid: false,
      message: 'API密钥格式不正确。请检查.env文件中的VITE_DASHSCOPE_API_KEY设置。'
    };
  }
  
  return { isValid: true };
};