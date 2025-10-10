/**
 * 环境变量工具函数
 * 提供安全访问环境变量的方法，避免TypeScript编译错误
 */

/**
 * 安全地获取环境变量
 * @param key 环境变量的键名
 * @param defaultValue 默认值（可选）
 * @returns 环境变量的值或默认值
 */
export const getEnv = (key: string, defaultValue: string = ''): string => {
  try {
    // 尝试直接访问import.meta.env
    // @ts-ignore - 忽略TypeScript编译错误
    const value = import.meta.env[key];
    return value !== undefined ? String(value) : defaultValue;
  } catch (error) {
    console.warn(`无法获取环境变量${key}:`, error);
    return defaultValue;
  }
};

/**
 * 获取DashScope API密钥
 * @returns API密钥
 */
export const getDashScopeApiKey = (): string => {
  return getEnv('VITE_DASHSCOPE_API_KEY', '');
};