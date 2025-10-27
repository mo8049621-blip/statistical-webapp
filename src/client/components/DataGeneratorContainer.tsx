import { useState } from 'react';
import { Box, Text, Tabs, Tab, Card, CardBody } from '@chakra-ui/react';
import DistributionGenerator from './DistributionGenerator';
import PairedDataGenerator from './PairedDataGenerator';
import TwoSampleDataGenerator from './TwoSampleDataGenerator';

interface DatasetWithInfo {
  data: number[];
  distributionInfo?: {
    type: string;
    name: string;
    parameters: Record<string, number>;
  };
}

interface DataGeneratorContainerProps {
  onDataGenerated: (dataWithInfo: DatasetWithInfo, datasetIndex: 1 | 2) => void;
  onPairedDataGenerated: (data1: number[], data2: number[]) => void;
  onDirectDataChange?: (data: number[], sourceInfo?: {type: string, name: string}) => void;
}

function DataGeneratorContainer({ onDataGenerated, onPairedDataGenerated, onDirectDataChange }: DataGeneratorContainerProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'two' | 'paired'>('single');

  // 处理单样本数据生成
  const handleSingleDataGenerated = (data: any, distributionInfo?: any) => {
    onDataGenerated({ data, distributionInfo }, 1);
  };

  // 处理两样本数据生成
  const handleTwoSampleDataGenerated = (data: { sample1: number[]; sample2: number[] }) => {
    if (data?.sample1 && data?.sample2) {
      onDataGenerated({ data: data.sample1 }, 1);
      onDataGenerated({ data: data.sample2 }, 2);
    }
  };

  // 处理配对数据生成
  const handlePairedDataGenerated = (data: { before: number[]; after: number[]; params?: any }) => {
    if (data?.before && data?.after) {
      onPairedDataGenerated(data.before, data.after);
      onDataGenerated({ data: data.before }, 1);
      onDataGenerated({ data: data.after }, 2);
    }
  };

  return (
    <Card mb={6}>
      <CardBody>
        <Text fontSize="lg" fontWeight="medium" mb={4}>数据生成</Text>
        
        <Box borderBottomWidth="1px" borderBottomColor="gray.200" mb={4}>
          <Tabs 
            index={activeTab === 'single' ? 0 : activeTab === 'two' ? 1 : 2}
            onChange={(index) => setActiveTab(index === 0 ? 'single' : index === 1 ? 'two' : 'paired')}
          >
            <Tab px={4} py={2}>单样本数据</Tab>
            <Tab px={4} py={2}>两样本数据</Tab>
            <Tab px={4} py={2}>配对数据</Tab>
          </Tabs>
        </Box>

        {activeTab === 'single' && (
          <DistributionGenerator 
            onDataChange={(data) => {
              if (onDirectDataChange) {
                // 对于文件上传等直接数据输入，使用专门的处理函数
                onDirectDataChange(data);
              } else {
                // 向后兼容
                handleSingleDataGenerated(data);
              }
            }}
          />
        )}

        {activeTab === 'two' && (
          <TwoSampleDataGenerator 
            onDataGenerated={handleTwoSampleDataGenerated}
          />
        )}

        {activeTab === 'paired' && (
          <PairedDataGenerator 
            onDataGenerated={handlePairedDataGenerated}
          />
        )}
      </CardBody>
    </Card>
  );
}

export default DataGeneratorContainer;