// 共享类型定义

// 基本统计量接口
export interface BasicStats {
  mean: number;
  std: number;
  variance?: number;
  median: number;
  skewness: number;
  kurtosis: number;
  count: number;
  min: number;
  max: number;
  mode?: number | number[];
}

export interface DistributionInfo {
  type: string;
  name: string;
  formula?: string;
  parameters?: Record<string, number | string>;
}

export interface DataInputPanelProps {
  onDataChange: (data: number[], distribution?: DistributionInfo | null) => void;
}

export interface FileUploaderProps {
  onDataChange: (data: number[], distribution?: DistributionInfo | null) => void;
}

export interface DistributionGeneratorProps {
  onDataChange: (data: number[], distribution?: DistributionInfo | null) => void;
}

export interface AIDataGeneratorProps {
  onDataChange: (data: number[], distribution?: DistributionInfo | null) => void;
}

export interface BasicStatisticsTabProps {
  dataset: number[];
}

export interface MLEMoMTabProps {
  dataset: number[];
  distribution: DistributionInfo | null;
  isGeneratedDataset?: boolean;
  basicStats?: BasicStats | null;
}

// 置信区间容器属性接口
export interface ConfidenceIntervalsContainerProps {
  dataset: number[];
  dataset2?: number[];
  pairedData?: { before: number[]; after: number[] };
  isGeneratedDataset?: boolean;
  distributionInfo?: DistributionInfo | null;
  basicStats?: BasicStats | null;
}

// 假设检验属性接口
export interface HypothesisTestingTabProps {
  dataset: number[];
  dataset2?: number[];
  pairedData?: { before: number[]; after: number[] };
  isGeneratedDataset?: boolean;
  distributionInfo?: DistributionInfo | null;
  basicStats?: BasicStats | null;
}

export interface DistributionParam {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface DistributionConfig {
  name: string;
  params: DistributionParam[];
  formula?: string;
}

export interface EstimationResult {
  method: string;
  params: Record<string, number>;
}