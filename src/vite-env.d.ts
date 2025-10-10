/**
 * Vite环境变量类型定义
 * 这个文件用于为import.meta.env提供TypeScript类型支持
 */

export interface ImportMetaEnv {
  readonly VITE_DASHSCOPE_API_KEY?: string;
  // 可以添加其他环境变量的类型定义
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}