import axios from 'axios';
import { AI_CONFIG } from '../config/aiConfig';

/**
 * 使用DashScope API生成数据
 * @param prompt 用户的自然语言提示
 * @param apiKey DashScope API密钥
 * @returns 生成的数据数组
 */
export const callDashScopeAPI = async (prompt: string, apiKey: string): Promise<number[]> => {
  try {
    // 构建请求参数
    const requestData = {
      model: AI_CONFIG.MODEL_NAME, // 使用配置文件中指定的模型
      input: {
        prompt: `请根据以下需求生成一组数值数据，并只返回JSON格式的数据数组，不要包含任何其他说明文字。\n${prompt}\n\n例如：如果需求是"生成10个0到100之间的随机数"，返回格式应为[1,2,3,4,5,6,7,8,9,10]`
      },
      parameters: {
        result_format: 'text'
      }
    };

    if (AI_CONFIG.DEBUG_MODE) {
      console.log('准备发送API请求:', {
        url: `${AI_CONFIG.API_BASE_URL}/services/aigc/text-generation/generation`,
        model: AI_CONFIG.MODEL_NAME,
        timeout: AI_CONFIG.API_TIMEOUT
      });
    }

    // 发送请求到DashScope API，添加超时设置
    // 使用正确的API路径，包含/api/v1/前缀
    const response = await axios.post(
      `${AI_CONFIG.API_BASE_URL}/api/v1/services/aigc/text-generation/generation`,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: AI_CONFIG.API_TIMEOUT,
        // 允许重定向
        maxRedirects: 5
      }
    );

    // 检查响应状态
    if (!response.data || !response.data.output || !response.data.output.text) {
      throw new Error('API返回的数据不完整');
    }

    // 解析响应
    const content = response.data.output.text;
    
    if (AI_CONFIG.DEBUG_MODE) {
      console.log('API返回原始内容:', content);
    }
    
    // 尝试解析JSON数据
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.every(item => typeof item === 'number')) {
        if (AI_CONFIG.DEBUG_MODE) {
          console.log('成功解析API返回的JSON数据，数据点数量:', data.length);
        }
        return data;
      } else {
        throw new Error('API返回的数据格式不正确，期望一个纯数字数组');
      }
    } catch (parseError) {
      // 如果JSON解析失败，尝试从文本中提取数字
      const numbers = extractNumbersFromText(content);
      if (numbers.length > 0) {
        if (AI_CONFIG.DEBUG_MODE) {
          console.log('从文本中提取到数字，数量:', numbers.length);
        }
        return numbers;
      }
      throw new Error(`无法解析API返回结果: ${content.substring(0, 100)}...`);
    }
  } catch (error) {
    console.error('调用DashScope API时出错:', error);
    
    // 提供更友好的错误信息
    if (typeof error === 'object' && error !== null) {
      // 检查ECONNABORTED错误
      if ('code' in error && error.code === 'ECONNABORTED') {
        throw new Error(`API调用超时，请检查网络连接或稍后再试。超时时间: ${AI_CONFIG.API_TIMEOUT/1000}秒`);
      }
      // 检查HTTP错误响应
      if ('response' in error && error.response !== null && typeof error.response === 'object') {
        const response = error.response;
        if ('status' in response && typeof response.status === 'number') {
          if (response.status === 401) {
            throw new Error('API密钥无效或已过期，请检查您的API密钥设置。');
          } else if (response.status === 429) {
            throw new Error('API调用过于频繁，请稍后再试。');
          } else if (response.status >= 500) {
            throw new Error('服务器暂时不可用，请稍后再试。');
          }
        }
      }
    }
    
    throw error;
  }
};

/**
 * 从文本中提取数字
 * @param text 输入文本
 * @returns 提取的数字数组
 */
function extractNumbersFromText(text: string): number[] {
  const numberRegex = /[-+]?\d*\.?\d+/g;
  const matches = text.match(numberRegex);
  return matches ? matches.map(match => parseFloat(match)) : [];
}

/**
 * 验证API密钥是否有效
 * @param apiKey 要验证的API密钥
 * @returns 验证结果
 */
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    // 使用一个简单的请求来验证API密钥
    await callDashScopeAPI('生成1个随机数', apiKey);
    return true;
  } catch (error) {
    return false;
  }
};