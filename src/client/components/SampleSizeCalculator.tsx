import React, { useState, useEffect } from 'react';
import { calculateSampleSizeForMean, calculateSampleSizeForProportion } from '../utils/statistics';
import { 
  Card, 
  CardBody, 
  Text, 
  FormControl, 
  Radio, 
  RadioGroup, 
  Input, 
  Button, 
  Box, 
  Alert, 
  Divider, 
  Grid, 
  GridItem, 
  Switch, 
  FormLabel, 
  FormHelperText 
} from '@chakra-ui/react';
import { BasicStats } from '../types';

interface SampleSizeCalculatorProps {
  dataset?: number[];
  basicStats?: BasicStats | null;
}

const SampleSizeCalculator: React.FC<SampleSizeCalculatorProps> = ({ dataset, basicStats }) => {
  // 计算类型：均值或比例
  const [calculationType, setCalculationType] = useState<'mean' | 'proportion'>('mean');
  // 置信水平
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95);
  // 边际误差（置信区间的一半宽度）
  const [marginOfError, setMarginOfError] = useState<string>('');
  // 均值计算的参数
  const [meanParams, setMeanParams] = useState({
    populationStd: '',
    estimatedStd: '',
    useTDistribution: false
  });
  // 比例计算的参数
  const [proportionParams, setProportionParams] = useState({
    estimatedProportion: '',
    useConservativeEstimate: true
  });
  // 计算结果
  const [result, setResult] = useState<number | null>(null);
  // 错误信息
  const [error, setError] = useState<string | null>(null);

  // 自动填充标准差（如果有数据集或基本统计量）
  useEffect(() => {
    // 优先使用传入的基本统计量
    if (basicStats && basicStats.std !== undefined) {
      setMeanParams(prev => ({ ...prev, estimatedStd: basicStats.std.toString() }));
    } 
    // 否则使用数据集计算
    else if (dataset && dataset.length > 0) {
      // 计算标准差的简单实现
      const mean = dataset.reduce((sum, val) => sum + val, 0) / dataset.length;
      const std = Math.sqrt(dataset.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (dataset.length - 1));
      setMeanParams(prev => ({ ...prev, estimatedStd: std.toString() }));
    }
  }, [dataset, basicStats]);

  // 处理计算
  const handleCalculate = () => {
    try {
      setError(null);
      setResult(null);

      // 验证边际误差
      const margin = parseFloat(marginOfError);
      if (isNaN(margin) || margin <= 0) {
        throw new Error('请输入有效的边际误差（必须大于0）');
      }

      let sampleSize: number;

      if (calculationType === 'mean') {
        // 均值样本量计算
        const populationStd = meanParams.populationStd ? parseFloat(meanParams.populationStd) : undefined;
        const estimatedStd = meanParams.estimatedStd ? parseFloat(meanParams.estimatedStd) : undefined;

        // 验证标准差
        if (populationStd !== undefined && (isNaN(populationStd) || populationStd <= 0)) {
          throw new Error('总体标准差必须大于0');
        }
        if (estimatedStd !== undefined && (isNaN(estimatedStd) || estimatedStd <= 0)) {
          throw new Error('估计的标准差必须大于0');
        }

        sampleSize = calculateSampleSizeForMean(confidenceLevel, margin, {
          populationStd,
          estimatedStd,
          useTDistribution: meanParams.useTDistribution
        });
      } else {
        // 比例样本量计算
        let estimatedProportion: number | undefined;
        if (!proportionParams.useConservativeEstimate) {
          estimatedProportion = parseFloat(proportionParams.estimatedProportion);
          if (isNaN(estimatedProportion) || estimatedProportion < 0 || estimatedProportion > 1) {
            throw new Error('估计的比例必须在0到1之间');
          }
        }

        sampleSize = calculateSampleSizeForProportion(confidenceLevel, margin, {
          estimatedProportion,
          useConservativeEstimate: proportionParams.useConservativeEstimate
        });
      }

      setResult(sampleSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : '计算过程中发生错误');
    }
  };

  // 重置表单
  const handleReset = () => {
    setMarginOfError('');
    setMeanParams({
      populationStd: '',
      estimatedStd: '',
      useTDistribution: false
    });
    setProportionParams({
      estimatedProportion: '',
      useConservativeEstimate: true
    });
    setResult(null);
    setError(null);
  };

  return (
    <Card maxW="100%" margin="20px auto">
      <CardBody>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          样本量计算器
        </Text>
        
        <Text fontSize="sm" color="gray.600" mb={4}>
          根据您指定的置信水平和边际误差，计算达到所需精度的最小样本量。
        </Text>

        <Divider my={2} />

        {/* 计算类型选择 */}
        <FormControl mb={3}>
          <FormLabel fontSize="lg" mb={2}>
            计算类型
          </FormLabel>
          <RadioGroup
            value={calculationType}
            onChange={(value) => {
              setCalculationType(value as 'mean' | 'proportion');
              setResult(null);
              setError(null);
            }}
          >
            <Box mr={4}>
              <Radio value="mean" />
              <Text ml={2} display="inline">均值</Text>
            </Box>
            <Box>
              <Radio value="proportion" />
              <Text ml={2} display="inline">比例</Text>
            </Box>
          </RadioGroup>
        </FormControl>

        <Grid templateColumns={{ sm: '1fr 1fr' }} gap={4}>
          {/* 置信水平 */}
          <GridItem>
            <FormControl>
              <FormLabel>置信水平</FormLabel>
              <Input
                type="number"
                value={confidenceLevel}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value > 0 && value < 1) {
                    setConfidenceLevel(value);
                    setResult(null);
                  }
                }}
                placeholder="例如: 0.95"
                mb={2}
              />
            </FormControl>
          </GridItem>

          {/* 边际误差 */}
          <GridItem>
            <FormControl>
              <FormLabel>边际误差</FormLabel>
              <Input
                type="number"
                value={marginOfError}
                onChange={(e) => {
                  setMarginOfError(e.target.value);
                  setResult(null);
                }}
                placeholder={calculationType === 'mean' ? "例如: 2.5" : "例如: 0.03"}
                mb={2}
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* 均值相关参数 */}
        {calculationType === 'mean' && (
          <Box mt={2} mb={3}>
            <FormLabel fontSize="lg" mb={2}>
              均值参数
            </FormLabel>
            
            <Grid templateColumns={{ sm: '1fr 1fr' }} gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>总体标准差（已知时）</FormLabel>
                  <Input
                    type="number"
                    value={meanParams.populationStd}
                    onChange={(e) => {
                      setMeanParams({ ...meanParams, populationStd: e.target.value });
                      setResult(null);
                    }}
                    mb={2}
                  />
                </FormControl>
              </GridItem>
              
              <GridItem>
                <FormControl>
                  <FormLabel>估计的标准差（方差未知时）</FormLabel>
                  <Input
                    type="number"
                    value={meanParams.estimatedStd}
                    onChange={(e) => {
                      setMeanParams({ ...meanParams, estimatedStd: e.target.value });
                      setResult(null);
                    }}
                    mb={1}
                  />
                  <FormHelperText>提示：当方差未知时，可通过预试验或历史数据估计标准差</FormHelperText>
                </FormControl>
              </GridItem>
            </Grid>
            
            <Box mt={2}>
              <Switch
                id="use-t-distribution"
                isChecked={meanParams.useTDistribution}
                onChange={(e) => {
                  setMeanParams({ ...meanParams, useTDistribution: e.target.checked });
                  setResult(null);
                }}
              />
              <FormLabel htmlFor="use-t-distribution" mb={0} ml={2} display="inline">
                使用t分布（小样本时更准确）
              </FormLabel>
            </Box>
            
            <Alert status="info" mt={2}>
              <Text fontSize="sm">
                当总体方差未知时，您必须提供估计的标准差。这可以通过以下方式获得：
              </Text>
              <ul style={{ marginTop: '5px', marginBottom: '5px', paddingLeft: '20px', fontSize: 'sm' }}>
                <li>先前的研究或类似研究的结果</li>
                <li>预试验数据</li>
                <li>如果范围已知，标准差可粗略估计为范围的1/6</li>
              </ul>
            </Alert>
          </Box>
        )}

        {/* 比例相关参数 */}
        {calculationType === 'proportion' && (
          <Box mt={2} mb={3}>
            <FormLabel fontSize="lg" mb={2}>
              比例参数
            </FormLabel>
            
            <Box mb={2}>
              <Switch
                id="use-conservative-estimate"
                isChecked={proportionParams.useConservativeEstimate}
                onChange={(e) => {
                  setProportionParams({ ...proportionParams, useConservativeEstimate: e.target.checked });
                  setResult(null);
                }}
              />
              <FormLabel htmlFor="use-conservative-estimate" mb={0} ml={2} display="inline">
                使用保守估计（p=0.5，确保最大样本量）
              </FormLabel>
            </Box>
            
            {!proportionParams.useConservativeEstimate && (
              <FormControl>
                <FormLabel>估计的比例</FormLabel>
                <Input
                  type="number"
                  value={proportionParams.estimatedProportion}
                  onChange={(e) => {
                    setProportionParams({ ...proportionParams, estimatedProportion: e.target.value });
                    setResult(null);
                  }}
                  placeholder="例如: 0.65"
                  my={2}
                />
              </FormControl>
            )}
            
            <Alert status="info" mt={2}>
              <Text fontSize="sm">
                保守估计使用p=0.5（此时方差最大），确保计算出的样本量足够大，无论实际比例如何。
                如果您有先前的研究或理论基础来估计比例，可以取消勾选保守估计并输入您的估计值。
              </Text>
            </Alert>
          </Box>
        )}

        {/* 操作按钮 */}
        <Box mt={3} display="flex" gap={2}>
          <Button colorScheme="blue" onClick={handleCalculate}>
            计算样本量
          </Button>
          <Button variant="outline" colorScheme="gray" onClick={handleReset}>
            重置
          </Button>
        </Box>

        {/* 错误信息 */}
        {error && (
          <Alert status="error" mt={3}>
            {error}
          </Alert>
        )}

        {/* 计算结果 - 优化显示效果 */}
        {result !== null && (
          <Card mt={4} bg="green.50" borderWidth={2} borderColor="green.300">
            <CardBody>
              <Text fontSize="lg" fontWeight="bold" mb={2} color="green.700">
                计算结果 ✓
              </Text>
              <Text fontSize="1.5rem" fontWeight="bold" color="green.800" mb={3}>
                所需最小样本量: {result}
              </Text>
              <Text fontSize="sm" color="gray.700" mt={1}>
                置信水平: {(confidenceLevel * 100).toFixed(1)}%
              </Text>
              <Text fontSize="sm" color="gray.700">
                边际误差: {marginOfError}
              </Text>
            </CardBody>
          </Card>
        )}
      </CardBody>
    </Card>
  );
};

export default SampleSizeCalculator;