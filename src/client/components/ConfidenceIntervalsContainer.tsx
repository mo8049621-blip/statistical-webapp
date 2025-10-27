import { useState } from 'react';
import { Box, Text, Button, Stack, Divider } from '@chakra-ui/react';
import OneSampleMeanCI from './OneSampleMeanCI';
import TwoSampleMeanCI from './TwoSampleMeanCI';
import ProportionCI from './ProportionCI';
import PairedMeanCI from './PairedMeanCI';
import TwoProportionCI from './TwoProportionCI';
import { BasicStats } from '../types';

interface ConfidenceIntervalsContainerProps {
  dataset?: number[];
  dataset2?: number[];
  pairedData?: {before: number[], after: number[]};
  isGeneratedDataset?: boolean; // 新增标志，指示数据集是否为系统生成
  distributionInfo?: { // 数据集分布信息
    type: string;
    name: string;
    parameters: Record<string, number>;
  };
  basicStats?: BasicStats | null;
}

function ConfidenceIntervalsContainer({ 
  dataset = [], 
  dataset2 = [], 
  pairedData = { before: [], after: [] },
  isGeneratedDataset = false,
  distributionInfo,
  basicStats
}: ConfidenceIntervalsContainerProps) {
  // 一级分类：均值之差 和 比例
  const [primaryCategory, setPrimaryCategory] = useState('mean'); // 'mean' 或 'proportion'
  
  // 二级分类：均值之差下的具体类型
  const [meanSubType, setMeanSubType] = useState('oneSample'); // 'oneSample', 'twoSample', 'paired'
  
  // 二级分类：比例下的具体类型
  const [proportionSubType, setProportionSubType] = useState('oneProportion'); // 'oneProportion', 'twoProportion'

  // 根据当前选中的类型渲染对应的置信区间组件
  const renderIntervalComponent = () => {
    if (primaryCategory === 'mean') {
      switch (meanSubType) {
        case 'oneSample':
          return <OneSampleMeanCI 
            dataset={dataset} 
            isGeneratedDataset={isGeneratedDataset} 
            distributionInfo={distributionInfo}
          />;
        case 'twoSample':
          return <TwoSampleMeanCI dataset1={dataset} dataset2={dataset2} />;
        case 'paired':
          return <PairedMeanCI pairedData={pairedData} />;
        default:
          return <OneSampleMeanCI dataset={dataset} />;
      }
    } else if (primaryCategory === 'proportion') {
      switch (proportionSubType) {
        case 'oneProportion':
          return <ProportionCI dataset={dataset} />;
        case 'twoProportion':
          return <TwoProportionCI />;
        default:
          return <ProportionCI dataset={dataset} />;
      }
    }
    return <OneSampleMeanCI dataset={dataset} basicStats={basicStats} />;
  };

  return (
    <Box p={6} bg="white" rounded="lg" shadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={6} textAlign="center">
        置信区间分析
      </Text>
      
      {/* 一级分类按钮 */}
      <Stack direction="row" gap={4} mb={4} justifyContent="center">
        <Button
          variant={primaryCategory === 'mean' ? "solid" : "outline"}
          colorScheme="blue"
          size="lg"
          onClick={() => setPrimaryCategory('mean')}
        >
          均值之差
        </Button>
        <Button
          variant={primaryCategory === 'proportion' ? "solid" : "outline"}
          colorScheme="blue"
          size="lg"
          onClick={() => setPrimaryCategory('proportion')}
        >
          比例
        </Button>
      </Stack>
      
      <Divider mb={4} />
      
      {/* 二级分类按钮 - 根据一级分类显示不同的选项 */}
      {primaryCategory === 'mean' && (
        <Stack direction="row" gap={2} mb={6} flexWrap="wrap" justifyContent="center">
          <Button
            variant={meanSubType === 'oneSample' ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setMeanSubType('oneSample')}
          >
            单样本
          </Button>
          <Button
            variant={meanSubType === 'twoSample' ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setMeanSubType('twoSample')}
          >
            两样本
          </Button>
          <Button
            variant={meanSubType === 'paired' ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setMeanSubType('paired')}
          >
            配对样本
          </Button>
        </Stack>
      )}
      
      {primaryCategory === 'proportion' && (
        <Stack direction="row" gap={2} mb={6} flexWrap="wrap" justifyContent="center">
          <Button
            variant={proportionSubType === 'oneProportion' ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setProportionSubType('oneProportion')}
          >
            单比例
          </Button>
          <Button
            variant={proportionSubType === 'twoProportion' ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setProportionSubType('twoProportion')}
          >
            双比例之差
          </Button>
        </Stack>
      )}
      
      {/* 渲染选中的置信区间组件 */}
      <Box p={4}>
        {renderIntervalComponent()}
      </Box>
    </Box>
  );
}

export default ConfidenceIntervalsContainer;