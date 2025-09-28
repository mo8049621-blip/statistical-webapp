import { useState } from 'react';
import { Box, Text, Container, Button, Grid } from '@chakra-ui/react';
import DataInputPanel from './components/DataInputPanel';
import BasicStatisticsTab from './components/BasicStatisticsTab';
import MLEMoMTab from './components/MLEMoMTab';
import { DistributionInfo } from './types';

function App() {
  const [dataset, setDataset] = useState<number[] | null>(null);
  const [distribution, setDistribution] = useState<DistributionInfo | null>(null);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<string>('statistics');

  const handleDataChange = (newData: number[], sourceDistribution: DistributionInfo | null = null) => {
    setDataset(newData);
    setDistribution(sourceDistribution);
  };

  return (
    <Container maxW="6xl" py={8}>
      <Text fontSize="3xl" fontWeight="bold" mb={8} textAlign="center">
          全面数据分析平台
        </Text>
      
      <DataInputPanel onDataChange={handleDataChange} />
      
      {dataset && (
        <Box mt={8}>
          <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={4}>
            <Button
              onClick={() => setActiveAnalysisTab('statistics')}
              variant={activeAnalysisTab === 'statistics' ? 'solid' : 'outline'}
              colorScheme="blue"
            >
              基本统计分析
            </Button>
            <Button
              onClick={() => setActiveAnalysisTab('estimation')}
              variant={activeAnalysisTab === 'estimation' ? 'solid' : 'outline'}
              colorScheme="blue"
            >
              MLE/MoM参数估计
            </Button>
          </Grid>
          
          {activeAnalysisTab === 'statistics' && (
            <BasicStatisticsTab dataset={dataset} />
          )}
          {activeAnalysisTab === 'estimation' && (
            <MLEMoMTab dataset={dataset} distribution={distribution} />
          )}
        </Box>
      )}
      
      {!dataset && (
        <Box mt={8} p={8} bg="gray.50" borderRadius="md" textAlign="center">
          <Text fontSize="lg" color="gray.500">
              请通过上方的数据输入面板导入或生成数据
            </Text>
        </Box>
      )}
    </Container>
  );
}

export default App;