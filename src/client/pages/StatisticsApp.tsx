import React, { useState, useMemo } from 'react';
import { Box, Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Divider, Alert, AlertIcon, Input, Button, Text, Checkbox, Stack, Textarea, Grid } from '@chakra-ui/react';
import FileUploader from '../components/FileUploader';
import DistributionGenerator from '../components/DistributionGenerator';
import ConfidenceIntervalsContainer from '../components/ConfidenceIntervalsContainer';
import BasicStatisticsTab from '../components/BasicStatisticsTab';
import MLEMoMTab from '../components/MLEMoMTab';
import HypothesisTestingTab from '../components/HypothesisTestingTab';
import SampleSizeCalculator from '../components/SampleSizeCalculator';
import { calculateMean, calculateStd, calculateMedian, calculateSkewness, calculateKurtosis } from '../utils/statistics';

// 定义数据集接口
interface Dataset {
  id: string;
  name: string;
  data: number[];
  timestamp: number;
}

const StatisticsApp: React.FC = () => {
  // 数据集状态管理
  const [dataset1, setDataset1] = useState<number[]>([]);
  const [dataset2, setDataset2] = useState<number[]>([]);
  const [pairedData, setPairedData] = useState<{sample1: number[], sample2: number[]}>({sample1: [], sample2: []});
  
  // 数据已更新标志，用于提醒用户
  const [dataUpdated, setDataUpdated] = useState<boolean>(false);
  
  // 标志数据集是否为系统生成
  const [isDatasetGenerated, setIsDatasetGenerated] = useState<boolean>(false);
  
  // 存储数据集的分布信息
  const [dataset1Distribution, setDataset1Distribution] = useState<{
    type: string;
    name: string;
    parameters: Record<string, number>;
  } | null>(null);
  
  // 保存的数据集列表
  const [savedDatasets, setSavedDatasets] = useState<Dataset[]>([]);
  
  // 数据集名称输入
  const [datasetName, setDatasetName] = useState<string>('');
  
  // 当前选择的数据集ID
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  
  // 直接数据输入
  const [directDataInput, setDirectDataInput] = useState<string>('');
  
  // 计算当前使用数据集的基本统计量
  const currentDataset = useMemo(() => {
    return selectedDatasetId ? getSelectedDataset(selectedDatasetId) : dataset1;
  }, [selectedDatasetId, dataset1, savedDatasets]);
  
  // 计算基本统计量
  const basicStats = useMemo(() => {
    if (currentDataset.length === 0) return null;
    
    return {
      mean: calculateMean(currentDataset),
      std: calculateStd(currentDataset),
      median: calculateMedian(currentDataset),
      skewness: calculateSkewness(currentDataset),
      kurtosis: calculateKurtosis(currentDataset),
      count: currentDataset.length,
      min: Math.min(...currentDataset),
      max: Math.max(...currentDataset)
    };
  }, [currentDataset]);
  
  // 判断数据是否可能来自正态分布（基于偏度和峰度的简单启发式规则）
  const isLikelyNormal = useMemo(() => {
    if (!basicStats || currentDataset.length < 30) return null;
    
    // 偏度和峰度都在合理范围内，则可能为正态分布
    const skewnessWithinRange = Math.abs(basicStats.skewness) < 0.5;
    const kurtosisWithinRange = Math.abs(basicStats.kurtosis) < 0.5;
    
    return skewnessWithinRange && kurtosisWithinRange;
  }, [basicStats, currentDataset.length]);

  // 处理数据生成事件
  // 数据生成处理函数 - 已保留用于向后兼容
  
  // 处理直接数据输入或上传（包含来源信息）
  const handleDirectDataChange = (data: number[]) => {
    setDataset1(data);
    setDirectDataInput(data.join(', '));
    setIsDatasetGenerated(false); // 标记为用户输入或上传的数据
    setDataset1Distribution(null); // 清除分布信息
    setPairedData({ sample1: [], sample2: [] });
    setDataUpdated(true);
    setTimeout(() => setDataUpdated(false), 3000);
  };

  const handleDataset1Change = (data: number[], distributionInfo?: any) => {
    setDataset1(data);
    setDirectDataInput(data.join(', '));
    if (distributionInfo && distributionInfo.type && distributionInfo.parameters) {
      setDataset1Distribution({
        type: distributionInfo.type,
        name: distributionInfo.name || distributionInfo.type,
        parameters: distributionInfo.parameters as Record<string, number>
      });
      setIsDatasetGenerated(true);
    } else {
      setDataset1Distribution(null);
      setIsDatasetGenerated(false);
    }
    setDataUpdated(true);
    setTimeout(() => setDataUpdated(false), 3000);
  };

  const handleDataset2Change = (data: number[]) => {
    setDataset2(data);
    setDataUpdated(true);
    setTimeout(() => setDataUpdated(false), 3000);
  };

  const handlePairedDataChange = (sample1: number[], sample2: number[], distributionInfo?: any) => {
    setPairedData({ sample1, sample2 });
    if (distributionInfo && distributionInfo.type && distributionInfo.parameters) {
      setDataset1Distribution({
        type: distributionInfo.type,
        name: distributionInfo.name || distributionInfo.type,
        parameters: distributionInfo.parameters as Record<string, number>
      });
      setIsDatasetGenerated(true);
    }
    setDataUpdated(true);
    setTimeout(() => setDataUpdated(false), 3000);
  };

  // 处理配对数据生成已移除，因为未使用
  
  // 处理直接数据输入
  const handleDirectDataInput = () => {
    try {
      // 解析数据
      const dataArray = directDataInput
        .split(/[\s,]+/)
        .filter(val => val.trim() !== '')
        .map(val => parseFloat(val))
        .filter(val => !isNaN(val));
      
      if (dataArray.length === 0) {
        throw new Error('请输入有效的数据');
      }
      
      handleDirectDataChange(dataArray);
    } catch (error) {
      alert(error instanceof Error ? error.message : '解析数据时发生错误');
    }
  };
  
  // 保存数据集
  const saveDataset = (data: number[], name: string) => {
    if (!name.trim()) {
      alert('请输入数据集名称');
      return;
    }
    
    const newDataset: Dataset = {
      id: `dataset_${Date.now()}`,
      name: name.trim(),
      data: [...data],
      timestamp: Date.now()
    };
    
    setSavedDatasets([...savedDatasets, newDataset]);
    setDatasetName('');
    alert('数据集保存成功！');
  };
  
  // 删除数据集
  const deleteDataset = (id: string) => {
    setSavedDatasets(savedDatasets.filter(dataset => dataset.id !== id));
    // 如果删除的是当前选中的数据集，清除选择
    if (selectedDatasetId === id) setSelectedDatasetId(null);
  };
  
  // 获取当前选中的数据集
  const getSelectedDataset = (id: string | null): number[] => {
    if (!id) return [];
    const dataset = savedDatasets.find(d => d.id === id);
    return dataset ? dataset.data : [];
  };

  // 选择历史数据集
  const handleHistoryDatasetSelect = (id: string) => {
    const dataset = savedDatasets.find(d => d.id === id);
    if (dataset) {
      setDataset1(dataset.data);
      setDirectDataInput(dataset.data.join(', '));
      setSelectedDatasetId(id);
      setDataset2([]);
      setPairedData({ sample1: [], sample2: [] });
      setIsDatasetGenerated(false); // 历史数据集默认为用户数据
      setDataset1Distribution(null); // 清除分布信息
      setDataUpdated(true);
      setTimeout(() => setDataUpdated(false), 3000);
    }
  };

  return (
    <Container maxW="container.lg" py={4}>
      <Heading as="h1" size="lg" mb={4} textAlign="center">
        统计分析工具
      </Heading>
      
      {/* 统一数据输入和生成区域 */}
      <Box 
        mb={6} 
        bg="white" 
        p={4} 
        borderRadius="lg" 
        boxShadow="0 2px 4px rgba(0,0,0,0.1)"
      >
        <Heading as="h2" size="md" mb={3} color="blue.600">
          数据输入与生成
        </Heading>
        
        <Tabs isFitted>
          <TabList mb={3}>
            <Tab>数据上传</Tab>
            <Tab>数据生成</Tab>
            <Tab>历史数据</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box p={4}>
                <Heading as="h3" size="sm" mb={3} color="blue.700">
                  直接输入数据
                </Heading>
                <Stack spacing={3} mb={6}>
                  <Textarea
                    value={directDataInput}
                    onChange={(e) => setDirectDataInput(e.target.value)}
                    placeholder="例如: 1.2 3.4 5.6 7.8 9.0"
                    size="md"
                    height="100px"
                    resize="vertical"
                  />
                  <Button onClick={handleDirectDataInput} colorScheme="blue" width="100%">
                    应用数据
                  </Button>
                </Stack>
                
                <Heading as="h3" size="sm" mb={3} color="blue.700">
                  CSV文件上传
                </Heading>
                <FileUploader 
                  onDataChange={(data, distributionInfo) => {
                    handleDirectDataChange(data);
                    
                    // 如果有分布信息，更新分布状态
                    if (distributionInfo && distributionInfo.type) {
                      setDataset1Distribution({
                        type: distributionInfo.type,
                        name: distributionInfo.name || distributionInfo.type,
                        parameters: {}
                      });
                      setIsDatasetGenerated(false);
                    } else {
                      setDataset1Distribution(null);
                      setIsDatasetGenerated(false);
                    }
                  }}
                />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box p={4}>
                <Heading as="h3" size="sm" mb={3} color="blue.700">
                  样本生成类型
                </Heading>
                <Tabs variant="enclosed" mb={4}>
                  <TabList>
                    <Tab>单样本</Tab>
                    <Tab>两样本</Tab>
                    <Tab>配对样本</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <DistributionGenerator 
                        onDataChange={(data, distributionInfo) => {
                          handleDataset1Change(data, distributionInfo);
                        }}
                      />
                    </TabPanel>
                    <TabPanel>
                      <Stack spacing={6}>
                        <Box>
                          <Heading as="h3" size="sm" mb={3} color="blue.700">
                            样本1生成
                          </Heading>
                          <DistributionGenerator 
                            onDataChange={(data, distributionInfo) => {
                              handleDataset1Change(data, distributionInfo);
                            }}
                          />
                        </Box>
                        <Box>
                          <Heading as="h3" size="sm" mb={3} color="blue.700">
                            样本2生成
                          </Heading>
                          <DistributionGenerator 
                            onDataChange={(data) => {
                              handleDataset2Change(data);
                            }}
                          />
                        </Box>
                      </Stack>
                    </TabPanel>
                    <TabPanel>
                      <Stack spacing={6}>
                        <Box>
                          <Heading as="h3" size="sm" mb={3} color="blue.700">
                            前测数据生成
                          </Heading>
                          <DistributionGenerator 
                            onDataChange={(data, distributionInfo) => {
                              handlePairedDataChange(data, pairedData.sample2, distributionInfo);
                            }}
                          />
                        </Box>
                        <Box>
                          <Heading as="h3" size="sm" mb={3} color="blue.700">
                            后测数据生成
                          </Heading>
                          <DistributionGenerator 
                            onDataChange={(data, distributionInfo) => {
                              handlePairedDataChange(pairedData.sample1, data, distributionInfo);
                            }}
                          />
                        </Box>
                      </Stack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </TabPanel>
            <TabPanel>
              <Stack spacing={3}>
                {/* 提示用户在数据集管理区域保存 */}
                {dataset1.length > 0 && (
                  <Alert status="info" mb={3} size="sm">
                    <AlertIcon />
                    您可以在下方的「数据集管理」区域保存和管理当前数据集
                  </Alert>
                )}
                
                {/* 历史数据集列表 */}
                <Box>
                  <Text fontSize="sm" mb={2} fontWeight="medium">选择历史数据集:</Text>
                  {savedDatasets.length === 0 ? (
                    <Text fontSize="sm" color="gray.500">暂无保存的数据集</Text>
                  ) : (
                    <Box maxHeight="200px" overflowY="auto" borderWidth={1} borderColor="gray.200" borderRadius="lg">
                      {savedDatasets.map(dataset => (
                        <Box 
                          key={dataset.id} 
                          p={2} 
                          borderBottomWidth={1} 
                          borderBottomColor="gray.100"
                          _hover={{ bg: "gray.50" }}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                              isChecked={selectedDatasetId === dataset.id}
                              onChange={() => handleHistoryDatasetSelect(dataset.id)}
                              mr={2}
                            />
                            <div>
                              <Text fontSize="sm" fontWeight="medium">{dataset.name}</Text>
                              <Text fontSize="xs" color="gray.500">{dataset.data.length}个观测值</Text>
                            </div>
                          </div>
                          <Button 
                            size="xs" 
                            colorScheme="red" 
                            onClick={() => deleteDataset(dataset.id)}
                          >
                            删除
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      <Divider my={4} />
      
      {/* 数据集管理区域 - 移到数据分析区域之前 */}
      <Box 
        bg="white" 
        p={4} 
        borderRadius="lg" 
        boxShadow="0 2px 4px rgba(0,0,0,0.1)"
        mb={4}
      >
        <Heading as="h2" size="md" mb={3} color="blue.600">
          数据集管理
        </Heading>
        
        {/* 数据更新提示 */}
        {dataUpdated && (
          <Alert status="success" mb={4} size="sm">
            <AlertIcon />
            数据已更新，可以开始分析或保存
          </Alert>
        )}
        
        {/* 保存当前数据集功能 */}
        {dataset1.length > 0 && (
          <Box mb={4} p={3} borderWidth={1} borderColor="blue.200" borderRadius="lg" bg="blue.50">
            <Text fontSize="sm" fontWeight="medium" mb={2}>保存当前生成的数据集:</Text>
            <Stack direction="row" gap={2}>
              <Input 
                value={datasetName} 
                onChange={(e) => setDatasetName(e.target.value)} 
                placeholder="输入数据集名称" 
                size="md"
                flex={1}
              />
              <Button 
                colorScheme="blue" 
                onClick={() => saveDataset(dataset1, datasetName || `数据集_${new Date().toLocaleTimeString()}`)}
              >
                保存数据集
              </Button>
            </Stack>
          </Box>
        )}
        
        {/* 已保存数据集列表和选择功能 */}
        {savedDatasets.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2}>选择要分析的数据集:</Text>
            <Box maxHeight={200} overflowY="auto" borderWidth={1} borderColor="gray.200" borderRadius="lg">
              {savedDatasets.map(dataset => (
                <Box 
                  key={dataset.id} 
                  p={2} 
                  borderBottomWidth={1} 
                  borderBottomColor="gray.100"
                  _hover={{ bg: "gray.50" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      isChecked={selectedDatasetId === dataset.id}
                      onChange={() => setSelectedDatasetId(
                        selectedDatasetId === dataset.id ? null : dataset.id
                      )}
                      mr={2}
                    />
                    <div>
                      <Text fontSize="sm" fontWeight="medium">{dataset.name}</Text>
                      <Text fontSize="xs" color="gray.500">{dataset.data.length}个观测值 · {new Date(dataset.timestamp).toLocaleString()}</Text>
                    </div>
                  </div>
                  <Button 
                    size="xs" 
                    colorScheme="red" 
                    onClick={() => deleteDataset(dataset.id)}
                  >
                    删除
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        
        {/* 当前选中数据集信息 */}
        {selectedDatasetId && (
          <Box mt={3} p={3} borderWidth={1} borderColor="green.200" borderRadius="lg" bg="green.50">
            <Text fontSize="sm" fontWeight="medium">当前选中的数据集:</Text>
            <Text fontSize="sm">{savedDatasets.find(d => d.id === selectedDatasetId)?.name}</Text>
            <Text fontSize="sm">数据点数量: {getSelectedDataset(selectedDatasetId).length}</Text>
          </Box>
        )}
        
        {savedDatasets.length === 0 && (
          <Alert status="info" mb={4} size="sm">
            <AlertIcon />
            暂无保存的数据集，生成数据后可以保存
          </Alert>
        )}
      </Box>
      
      {/* 分析区域 */}
      <Box 
        bg="white" 
        p={4} 
        borderRadius="lg" 
        boxShadow="0 2px 4px rgba(0,0,0,0.1)"
      >
        <Heading as="h2" size="md" mb={3} color="blue.600">
          统计分析
        </Heading>
        
        {/* 显示当前使用的数据集信息和基本统计量 */}
        {(currentDataset.length > 0) && (
          <Box mb={4} p={3} borderWidth={1} borderColor="green.200" borderRadius="lg" bg="green.50">
            <Text fontSize="sm" fontWeight="medium">当前使用的数据集:</Text>
            {selectedDatasetId ? (
              <Text fontSize="sm">名称: {savedDatasets.find(d => d.id === selectedDatasetId)?.name}</Text>
            ) : null}
            
            {basicStats && (
              <Box mt={2}>
                <Grid gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                  <Text fontSize="sm">数据点数量: {basicStats.count}</Text>
                  <Text fontSize="sm">均值: {basicStats.mean.toFixed(4)}</Text>
                  <Text fontSize="sm">标准差: {basicStats.std.toFixed(4)}</Text>
                  <Text fontSize="sm">中位数: {basicStats.median.toFixed(4)}</Text>
                  <Text fontSize="sm">最小值: {basicStats.min.toFixed(4)}</Text>
                  <Text fontSize="sm">最大值: {basicStats.max.toFixed(4)}</Text>
                  {basicStats.count >= 30 && (
                    <>
                      <Text fontSize="sm">偏度: {basicStats.skewness.toFixed(4)}</Text>
                      <Text fontSize="sm">峰度: {basicStats.kurtosis.toFixed(4)}</Text>
                    </>
                  )}
                </Grid>
                
                {/* 数据分布提示 */}
                {!isDatasetGenerated && !dataset1Distribution && isLikelyNormal !== null && (
                  <Text fontSize="sm" mt={2} color={isLikelyNormal ? "blue.600" : "orange.600"}>
                    数据分布提示: {isLikelyNormal 
                      ? "数据可能服从正态分布，统计分析可考虑使用参数方法"
                      : "数据可能不服从正态分布，建议进行分布检验或使用非参数方法"
                    }
                  </Text>
                )}
              </Box>
            )}
          </Box>
        )}
        
        {/* 使用Tabs组织不同的分析功能 - 注意避免之前的Context错误问题 */}
        <Tabs isFitted variant="enclosed">
          <TabList mb={4}>
            <Tab>基本统计分析</Tab>
            <Tab>置信区间</Tab>
            <Tab>MLE & MOM</Tab>
            <Tab>假设检验</Tab>
            <Tab>样本量计算</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <BasicStatisticsTab 
                dataset={selectedDatasetId ? getSelectedDataset(selectedDatasetId) : dataset1}
                basicStats={basicStats}
              />
            </TabPanel>
            <TabPanel>
              <ConfidenceIntervalsContainer 
              dataset={currentDataset}
              dataset2={dataset2}
              pairedData={pairedData ? {before: pairedData.sample1, after: pairedData.sample2} : undefined}
              isGeneratedDataset={!selectedDatasetId && isDatasetGenerated}
              distributionInfo={!selectedDatasetId && dataset1Distribution || undefined}
              basicStats={basicStats}
            />
          </TabPanel>
            <TabPanel>
              <MLEMoMTab 
              dataset={currentDataset}
              distribution={!selectedDatasetId && dataset1Distribution?.type || ''}
            />
          </TabPanel>
            <TabPanel>
              <HypothesisTestingTab 
              dataset={currentDataset}
            />
          </TabPanel>
            <TabPanel>
              <SampleSizeCalculator 
                basicStats={basicStats}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      {/* 如果没有数据集，显示提示 */}
      {dataset1.length === 0 && (
        <Alert status="info" mb={4} size="sm">
          <AlertIcon />
          请先使用上方数据生成器生成数据
        </Alert>
      )}
    </Container>
  );
};

export default StatisticsApp;