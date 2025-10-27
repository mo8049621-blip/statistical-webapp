import React, { useState } from 'react';
import { Box, Text, Grid, Card, CardBody, Select, FormControl, FormLabel, Switch, Input, Button, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { calculateConfidenceInterval, calculateMean } from '../utils/statistics';
import { BasicStats } from '../types';

interface OneSampleMeanCIProps {
  dataset?: number[];
  isGeneratedDataset?: boolean; // 新增标志，指示数据集是否为系统生成
  distributionInfo?: { // 数据集分布信息
    type: string;
    name: string;
    parameters: Record<string, number>;
  };
  basicStats?: BasicStats | null;
}

function OneSampleMeanCI({ dataset = [], isGeneratedDataset = false, distributionInfo, basicStats }: OneSampleMeanCIProps) {
  // 置信区间计算选项
  const [ciOptions, setCiOptions] = useState({
    confidenceLevel: 0.95,
    isNormal: false, // 默认不假设为正态分布
    knownVariance: false, // 默认未知方差
    populationVariance: 0
  });
  
  // 计算样本方差（用于生成数据集时自动填充）
  const calculateSampleVariance = (data: number[]) => {
    if (data.length <= 1) return 0;
    const mean = (basicStats?.mean || data.reduce((sum, val) => sum + val, 0) / data.length);
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
    return variance;
  };
  
  // 检查数据集是否为空
  const isDatasetEmpty = dataset.length === 0 && (!basicStats || basicStats.count === 0);
  
  // 获取样本统计量，优先使用传入的统计量
  const sampleSize = basicStats?.count || dataset.length || 0;
  const sampleMean = basicStats?.mean || (dataset.length > 0 ? calculateMean(dataset) : 0);
  const sampleVariance = basicStats?.variance || (sampleSize > 1 && dataset.length > 0 ? calculateSampleVariance(dataset) : 0);
  
  // 当数据集变化且有分布信息时，根据实际分布类型设置参数
  React.useEffect(() => {
    if (isGeneratedDataset && dataset.length > 0 && distributionInfo) {
      const variance = calculateSampleVariance(dataset);
      // 只有当分布类型是正态分布时，才假设总体为正态分布
      const isActualNormal = distributionInfo.type === 'normal';
      
      setCiOptions(prev => ({
        ...prev,
        populationVariance: variance,
        isNormal: isActualNormal,
        knownVariance: true // 对于生成数据，我们知道分布参数
      }));
    }
  }, [dataset, isGeneratedDataset, distributionInfo]);
  
  // 计算结果状态
  const [result, setResult] = useState<{
    mean: number;
    confidenceInterval: { 
      lower: number; 
      upper: number; 
      marginOfError: number;
      method: string;
      criticalValue: number;
    };
  } | null>(null);

  const handleCalculate = () => {
    try {
      if (dataset.length === 0) {
        throw new Error('请先在上方选择或生成数据集');
      }
      
      // 计算均值，优先使用传入的统计量
      const mean = sampleMean;
      
      // 计算置信区间
      const confidenceInterval = calculateConfidenceInterval(
        dataset,
        ciOptions.confidenceLevel,
        {
          isNormal: ciOptions.isNormal,
          knownVariance: ciOptions.knownVariance,
          populationVariance: ciOptions.populationVariance
        }
      );
      
      setResult({
        mean,
        confidenceInterval
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : '计算过程中发生错误');
    }
  };

  // 如果数据集为空，显示提示信息
  if (isDatasetEmpty) {
    return (
      <Box p={4}>
        <Alert status="info" mt={4}>
          <AlertIcon />
          <AlertDescription>请先上传或生成数据，然后再进行置信区间计算。</AlertDescription>
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box>
      <Text fontSize="lg" mb={4}>单样本均值置信区间计算</Text>
      
      {dataset.length === 0 && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          请先在上方的数据输入与生成区域选择或生成数据集
        </Alert>
      )}
      
      <Card mb={6}>
        <CardBody>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={4}>
            <FormControl>
              <FormLabel>置信水平</FormLabel>
              <Select
                value={ciOptions.confidenceLevel}
                onChange={(e) => setCiOptions({ ...ciOptions, confidenceLevel: parseFloat(e.target.value) })}
              >
                <option value="0.90">90%</option>
                <option value="0.95">95%</option>
                <option value="0.99">99%</option>
                <option value="0.999">99.9%</option>
              </Select>
            </FormControl>
            
            {/* 仅当不是生成数据集时，才显示手动设置选项 */}
            {!isGeneratedDataset && (
              <>
                <FormControl>
                  <FormLabel>总体已知是正态分布</FormLabel>
                  <Switch
                    isChecked={ciOptions.isNormal}
                    onChange={(e) => setCiOptions({ ...ciOptions, isNormal: e.target.checked })}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>已知总体方差</FormLabel>
                  <Switch
                    isChecked={ciOptions.knownVariance}
                    onChange={(e) => setCiOptions({ ...ciOptions, knownVariance: e.target.checked })}
                  />
                </FormControl>
                
                {ciOptions.knownVariance && (
                  <FormControl>
                    <FormLabel>总体方差值</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={ciOptions.populationVariance}
                      onChange={(e) => setCiOptions({ ...ciOptions, populationVariance: parseFloat(e.target.value) || 0 })}
                    />
                  </FormControl>
                )}
              </>
            )}
            
            {/* 对于生成数据集，显示实际的分布信息 */}
            {isGeneratedDataset && dataset.length > 0 && distributionInfo && (
              <FormControl>
                <FormLabel>数据集分布信息</FormLabel>
                <Box p={3} bg="green.50" borderRadius="md" borderWidth={1} borderColor="green.200">
                  <Text>• 分布类型: {distributionInfo.name}</Text>
                  <Text>• {distributionInfo.type === 'normal' ? '假设总体为正态分布' : '根据中心极限定理，使用t分布或正态近似'}</Text>
                  <Text>• 自动使用样本方差: {ciOptions.populationVariance.toFixed(6)}</Text>
                  <Text>• 样本量: {sampleSize}</Text>
                  <Text>• 样本均值: {sampleMean.toFixed(4)}</Text>
                  <Text>• 样本方差: {sampleVariance.toFixed(6)}</Text>
                  {/* 显示分布参数 */}
                  {Object.entries(distributionInfo.parameters).map(([key, value]) => (
                    <Text key={key}>• {key}: {value.toFixed(4)}</Text>
                  ))}
                </Box>
              </FormControl>
            )}
          </Grid>
          
          <Button 
            onClick={handleCalculate} 
            colorScheme="blue" 
            width="100%"
            disabled={dataset.length === 0}
          >
            计算置信区间
          </Button>
        </CardBody>
      </Card>
      
      {result && (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
          <Card>
            <CardBody>
              <Text fontSize="sm" color="gray.500">样本均值</Text>
              <Text fontSize="2xl" fontWeight="bold">{result.mean.toFixed(4)}</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Text fontSize="sm" color="gray.500">置信区间下限</Text>
              <Text fontSize="2xl" fontWeight="bold">{result.confidenceInterval.lower.toFixed(4)}</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Text fontSize="sm" color="gray.500">置信区间上限</Text>
              <Text fontSize="2xl" fontWeight="bold">{result.confidenceInterval.upper.toFixed(4)}</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Text fontSize="sm" color="gray.500">边际误差</Text>
              <Text fontSize="2xl" fontWeight="bold">{result.confidenceInterval.marginOfError.toFixed(4)}</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Text fontSize="sm" color="gray.500">计算方法</Text>
              <Text fontSize="lg" fontWeight="bold">{result.confidenceInterval.method}</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Text fontSize="sm" color="gray.500">临界值</Text>
              <Text fontSize="2xl" fontWeight="bold">{result.confidenceInterval.criticalValue.toFixed(4)}</Text>
            </CardBody>
          </Card>
        </Grid>
      )}
    </Box>
  );
}

export default OneSampleMeanCI;