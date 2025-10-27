import React, { useState } from 'react';
import { Box, Text, Tabs, Tab, FormControl, FormLabel, Input, Select, Button, Card, CardBody, Grid, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { calculateProportionConfidenceInterval, calculateTwoProportionConfidenceInterval } from '../utils/statistics';

interface ProportionCIComponentProps {
  // 可以根据需要添加props
}

const ProportionCIComponent: React.FC<ProportionCIComponentProps> = () => {
  // 单比例参数
  const [singleSuccessCount, setSingleSuccessCount] = useState<string>('185');
  const [singleSampleSize, setSingleSampleSize] = useState<string>('351');
  const [singleConfidenceLevel, setSingleConfidenceLevel] = useState<string>('0.95');
  const [singleMethod, setSingleMethod] = useState<'wald' | 'wilson'>('wald');
  
  // 两比例参数
  const [successCount1, setSuccessCount1] = useState<string>('45');
  const [sampleSize1, setSampleSize1] = useState<string>('100');
  const [successCount2, setSuccessCount2] = useState<string>('30');
  const [sampleSize2, setSampleSize2] = useState<string>('100');
  const [twoConfidenceLevel, setTwoConfidenceLevel] = useState<string>('0.95');
  const [twoMethod, setTwoMethod] = useState<'wald' | 'continuity'>('wald');
  
  const [singleResults, setSingleResults] = useState<any>(null);
  const [twoResults, setTwoResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'two'>('single');
  const [singleError, setSingleError] = useState<string | null>(null);
  const [twoError, setTwoError] = useState<string | null>(null);
  const [isSingleCalculated, setIsSingleCalculated] = useState(false);
  const [isTwoCalculated, setIsTwoCalculated] = useState(false);
  
  // 设置示例数据
  const setExampleData = () => {
    setSuccessCount1('45');
    setSampleSize1('100');
    setSuccessCount2('30');
    setSampleSize2('100');
    setTwoConfidenceLevel('0.95');
    setTwoMethod('wald');
    setTwoError('');
    setTwoResults(null);
    setIsTwoCalculated(false);
  };
  
  // 生成随机数据
  const generateRandomData = () => {
    const n1 = Math.floor(Math.random() * 50) + 50; // 50-100之间的样本大小
    const n2 = Math.floor(Math.random() * 50) + 50;
    const p1 = Math.random() * 0.8 + 0.1; // 0.1-0.9之间的概率
    const p2 = Math.random() * 0.8 + 0.1;
    
    const y1 = Math.floor(n1 * p1);
    const y2 = Math.floor(n2 * p2);
    
    setSuccessCount1(y1.toString());
    setSampleSize1(n1.toString());
    setSuccessCount2(y2.toString());
    setSampleSize2(n2.toString());
    setTwoError('');
    setTwoResults(null);
    setIsTwoCalculated(false);
  };

  const handleSingleProportionCalculate = () => {
    // 重置状态
    setSingleError(null);
    setSingleResults(null);
    setIsSingleCalculated(true);
    
    try {
      const successCount = parseInt(singleSuccessCount, 10);
      const n = parseInt(singleSampleSize, 10);
      const confidenceLevel = parseFloat(singleConfidenceLevel);
      
      // 输入验证
      if (!singleSuccessCount || !singleSampleSize || !singleConfidenceLevel) {
        throw new Error('请填写所有必填字段');
      }
      
      if (isNaN(successCount) || isNaN(n) || isNaN(confidenceLevel)) {
        throw new Error('请输入有效的数字');
      }
      
      if (n <= 0) {
        throw new Error('样本大小必须大于0');
      }
      
      if (successCount < 0 || successCount > n) {
        throw new Error('成功次数必须在0到样本大小之间');
      }
      
      if (confidenceLevel <= 0 || confidenceLevel >= 1) {
        throw new Error('置信水平必须在0到1之间');
      }
      
      // 调用统计函数并获取结果
      const results = calculateProportionConfidenceInterval(successCount, n, confidenceLevel, { method: singleMethod });
      
      // 转换结果格式以匹配组件期望的属性名
      // 计算标准误
      const standardError = Math.sqrt((results.proportion * (1 - results.proportion)) / n);
      
      const formattedResults = {
        ...results,
        sampleProportion: results.proportion,
        lowerBound: results.lower,
        upperBound: results.upper,
        confidenceLevel: confidenceLevel,
        standardError: standardError
      };
      
      setSingleResults(formattedResults);
    } catch (error) {
      setSingleError((error as Error).message);
    }
  };

  const handleTwoProportionCalculate = () => {
    // 重置状态
    setTwoError('');
    setTwoResults(null);
    setIsTwoCalculated(true);
    
    try {
      const y1 = parseInt(successCount1, 10);
      const n1 = parseInt(sampleSize1, 10);
      const y2 = parseInt(successCount2, 10);
      const n2 = parseInt(sampleSize2, 10);
      const confidenceLevel = parseFloat(twoConfidenceLevel);
      
      // 输入验证
      if (!successCount1 || !sampleSize1 || !successCount2 || !sampleSize2 || !twoConfidenceLevel) {
        throw new Error('请填写所有必填字段');
      }
      
      if (isNaN(y1) || isNaN(n1) || isNaN(y2) || isNaN(n2) || isNaN(confidenceLevel)) {
        throw new Error('请输入有效的数字');
      }
      
      if (n1 <= 0 || n2 <= 0) {
        throw new Error('样本大小必须大于0');
      }
      
      if (y1 < 0 || y1 > n1 || y2 < 0 || y2 > n2) {
        throw new Error('成功次数必须在0到对应样本大小之间');
      }
      
      if (confidenceLevel <= 0 || confidenceLevel >= 1) {
        throw new Error('置信水平必须在0到1之间');
      }
      
      // 计算样本比例
      const p1 = y1 / n1;
      const p2 = y2 / n2;
      
      // 调用统计函数并获取结果，确保正确传递options对象
      const results = calculateTwoProportionConfidenceInterval(
        y1, 
        n1, 
        y2, 
        n2, 
        confidenceLevel, 
        { method: twoMethod }
      );
      
      // 确保结果存在
      if (!results) {
        throw new Error('计算结果为空');
      }
      
      // 转换结果格式以匹配组件期望的属性名
      const formattedResults = {
        sampleProportion1: p1,
        sampleProportion2: p2,
        proportionDifference: p1 - p2,
        lowerBound: results.lower !== undefined ? results.lower : null,
        upperBound: results.upper !== undefined ? results.upper : null,
        confidenceLevel: confidenceLevel,
        // 直接使用results中的属性，无需重新计算
        criticalValue: results.criticalValue || null,
        standardError: Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2),
        marginOfError: results.marginOfError || null
      };
      
      // 确保设置结果
      setTwoResults(formattedResults);
    } catch (error) {
      setTwoError((error as Error).message);
      setTwoResults(null);
    }
  };

  return (
    <Box p={6} bg="white" rounded="lg" shadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={6} textAlign="center">比例置信区间计算</Text>
      
      <Tabs index={activeTab === 'single' ? 0 : 1} onChange={(index) => setActiveTab(index === 0 ? 'single' : 'two')} mb={6}>
        <Box borderBottomWidth="1px" borderBottomColor="gray.200">
          <Tab px={4} py={2}>单比例置信区间</Tab>
          <Tab px={4} py={2}>两比例之差置信区间</Tab>
        </Box>
      </Tabs>

      {activeTab === 'single' && (
        <Box>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={6}>
            <FormControl>
              <FormLabel fontSize="sm">成功次数 (y)</FormLabel>
              <Input
                type="number"
                value={singleSuccessCount}
                onChange={(e) => setSingleSuccessCount(e.target.value)}
                min="0"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">样本大小 (n)</FormLabel>
              <Input
                type="number"
                value={singleSampleSize}
                onChange={(e) => setSingleSampleSize(e.target.value)}
                min="1"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">置信水平</FormLabel>
              <Select
                value={singleConfidenceLevel}
                onChange={(e) => setSingleConfidenceLevel(e.target.value)}
              >
                <option value="0.90">90%</option>
                <option value="0.95">95%</option>
                <option value="0.99">99%</option>
                <option value="">自定义</option>
              </Select>
              {singleConfidenceLevel && !['0.90', '0.95', '0.99'].includes(singleConfidenceLevel) && (
                <Input
                  type="number"
                  step="0.01"
                  value={singleConfidenceLevel}
                  onChange={(e) => setSingleConfidenceLevel(e.target.value)}
                  min="0.01"
                  max="0.99"
                  mt={2}
                />
              )}
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">计算方法</FormLabel>
              <Select
                value={singleMethod}
                onChange={(e) => setSingleMethod(e.target.value as 'wald' | 'wilson')}
              >
                <option value="wald">Wald区间</option>
                <option value="wilson">Wilson得分区间</option>
              </Select>
            </FormControl>
          </Grid>

          <Box mt={6}>
            <Button
              onClick={handleSingleProportionCalculate}
              colorScheme="blue"
              size="lg"
              width="100%"
            >
              计算单比例置信区间
            </Button>
          </Box>
          
          {/* 错误提示 */}
          {singleError && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertDescription>{singleError}</AlertDescription>
            </Alert>
          )}
          
          {/* 提示信息 */}
          {isSingleCalculated && !singleError && !singleResults && (
            <Alert status="warning" mt={4}>
              <AlertIcon />
              <AlertDescription>无法计算结果，请检查输入值是否有效</AlertDescription>
            </Alert>
          )}
          
          {/* 计算结果 */}
          {singleResults && (
            <Card mt={6}>
              <CardBody>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>计算结果</Text>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600">样本比例 (̂p):</Text>
                    <Text fontWeight="medium">{singleResults.sampleProportion ? singleResults.sampleProportion.toFixed(4) : '无法计算'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">临界值 (z*):</Text>
                    <Text fontWeight="medium">{singleResults.criticalValue ? singleResults.criticalValue.toFixed(4) : '无法计算'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">标准误:</Text>
                    <Text fontWeight="medium">{singleResults.standardError ? singleResults.standardError.toFixed(6) : '无法计算'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">边际误差:</Text>
                    <Text fontWeight="medium">{singleResults.marginOfError ? singleResults.marginOfError.toFixed(4) : '无法计算'}</Text>
                  </Box>
                </Grid>
                <Box mt={4}>
                  <Text fontSize="sm" color="gray.600">{singleResults.confidenceLevel ? singleResults.confidenceLevel * 100 : '--'}% 置信区间:</Text>
                  <Text fontWeight="bold" fontSize="lg">
                    {singleResults.lowerBound !== undefined && singleResults.upperBound !== undefined 
                      ? `[${singleResults.lowerBound.toFixed(4)}, ${singleResults.upperBound.toFixed(4)}]` 
                      : '无法计算'}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          )}
        </Box>
      )}

      {activeTab === 'two' && (
        <Box>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={6}>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>总体 1</Text>
              <Grid gap={4}>
                <FormControl>
                  <FormLabel fontSize="xs" color="gray.500">成功次数 (y₁)</FormLabel>
                  <Input
                    type="number"
                    value={successCount1}
                    onChange={(e) => setSuccessCount1(e.target.value)}
                    min="0"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" color="gray.500">样本大小 (n₁)</FormLabel>
                  <Input
                    type="number"
                    value={sampleSize1}
                    onChange={(e) => setSampleSize1(e.target.value)}
                    min="1"
                  />
                </FormControl>
              </Grid>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>总体 2</Text>
              <Grid gap={4}>
                <FormControl>
                  <FormLabel fontSize="xs" color="gray.500">成功次数 (y₂)</FormLabel>
                  <Input
                    type="number"
                    value={successCount2}
                    onChange={(e) => setSuccessCount2(e.target.value)}
                    min="0"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" color="gray.500">样本大小 (n₂)</FormLabel>
                  <Input
                    type="number"
                    value={sampleSize2}
                    onChange={(e) => setSampleSize2(e.target.value)}
                    min="1"
                  />
                </FormControl>
              </Grid>
            </Box>
            <FormControl>
              <FormLabel fontSize="sm">置信水平</FormLabel>
              <Select
                value={twoConfidenceLevel}
                onChange={(e) => setTwoConfidenceLevel(e.target.value)}
              >
                <option value="0.90">90%</option>
                <option value="0.95">95%</option>
                <option value="0.99">99%</option>
                <option value="">自定义</option>
              </Select>
              {twoConfidenceLevel && !['0.90', '0.95', '0.99'].includes(twoConfidenceLevel) && (
                <Input
                  type="number"
                  step="0.01"
                  value={twoConfidenceLevel}
                  onChange={(e) => setTwoConfidenceLevel(e.target.value)}
                  min="0.01"
                  max="0.99"
                  mt={2}
                />
              )}
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">计算方法</FormLabel>
              <Select
                value={twoMethod}
                onChange={(e) => setTwoMethod(e.target.value as 'wald' | 'continuity')}
              >
                <option value="wald">Wald区间</option>
                <option value="continuity">连续性修正</option>
              </Select>
            </FormControl>
          </Grid>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mt={6}>
            <Button
              onClick={setExampleData}
              colorScheme="green"
              size="lg"
              width="100%"
            >
              示例数据
            </Button>
            <Button
              onClick={generateRandomData}
              colorScheme="purple"
              size="lg"
              width="100%"
            >
              随机数据
            </Button>
            <Button
              onClick={handleTwoProportionCalculate}
              colorScheme="blue"
              size="lg"
              width="100%"
            >
              计算
            </Button>
          </Grid>
          
          {/* 错误提示 */}
          {twoError && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertDescription>{twoError}</AlertDescription>
            </Alert>
          )}
          
          {/* 提示信息 */}
          {isTwoCalculated && !twoError && !twoResults && (
            <Alert status="warning" mt={4}>
              <AlertIcon />
              <AlertDescription>无法计算结果，请检查输入值是否有效</AlertDescription>
            </Alert>
          )}
          
          {/* 计算结果 */}
          {twoResults && (
            <Card mt={6}>
              <CardBody>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>计算结果</Text>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600">样本比例1 (̂p₁):</Text>
                    <Text fontWeight="medium">{twoResults.sampleProportion1 ? twoResults.sampleProportion1.toFixed(4) : '无法计算'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">样本比例2 (̂p₂):</Text>
                    <Text fontWeight="medium">{twoResults.sampleProportion2 ? twoResults.sampleProportion2.toFixed(4) : '无法计算'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">比例差 (̂p₁ - ̂p₂):</Text>
                    <Text fontWeight="medium">{twoResults.proportionDifference ? twoResults.proportionDifference.toFixed(4) : '无法计算'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">临界值 (z*):</Text>
                    <Text fontWeight="medium">{twoResults.criticalValue ? twoResults.criticalValue.toFixed(4) : '无法计算'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">标准误:</Text>
                    <Text fontWeight="medium">{twoResults.standardError ? twoResults.standardError.toFixed(6) : '无法计算'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">边际误差:</Text>
                    <Text fontWeight="medium">{twoResults.marginOfError ? twoResults.marginOfError.toFixed(4) : '无法计算'}</Text>
                  </Box>
                </Grid>
                <Box mt={4}>
                  <Text fontSize="sm" color="gray.600">{twoResults.confidenceLevel ? twoResults.confidenceLevel * 100 : '--'}% 置信区间:</Text>
                  <Text fontWeight="bold" fontSize="lg">
                    {twoResults.lowerBound !== undefined && twoResults.upperBound !== undefined 
                      ? `[${twoResults.lowerBound.toFixed(4)}, ${twoResults.upperBound.toFixed(4)}]` 
                      : '无法计算'}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProportionCIComponent;