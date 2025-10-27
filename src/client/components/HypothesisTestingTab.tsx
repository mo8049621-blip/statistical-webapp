import React, { useState } from 'react';
import { Box, Text, Grid, Select, FormControl, FormLabel, Input, Button, Card, CardBody, Alert, AlertIcon, Stack } from '@chakra-ui/react';
import { performZTest, performTTest } from '../utils/statistics';

interface HypothesisTestingTabProps {
  dataset: number[];
}

const HypothesisTestingTab: React.FC<HypothesisTestingTabProps> = ({ dataset }) => {
  // 检验参数状态
  const [mu0, setMu0] = useState<number>(0);
  const [alpha, setAlpha] = useState<string>('0.05');
  const [testType, setTestType] = useState<'two' | 'left' | 'right'>('two');
  const [varianceType, setVarianceType] = useState<'known' | 'unknown'>('unknown');
  const [sigma, setSigma] = useState<number>(1);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 执行假设检验
  const handleTest = () => {
    try {
      setError(null);
      
      // 验证输入参数
      const alphaNum = parseFloat(alpha);
      if (isNaN(alphaNum) || alphaNum <= 0 || alphaNum >= 1) {
        throw new Error('显著性水平必须在0到1之间');
      }
      
      if (varianceType === 'known' && (!sigma || sigma <= 0)) {
        throw new Error('当方差已知时，必须提供有效的总体标准差');
      }

      // 统计量计算现在在performZTest和performTTest函数内部完成
      
      let result;
      if (varianceType === 'known') {
        // 执行Z检验
        result = performZTest(dataset, mu0, sigma, alphaNum, testType);
      } else {
        // 执行t检验
        result = performTTest(dataset, mu0, alphaNum, testType);
      }
      
      setTestResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '检验过程中发生错误');
      setTestResult(null);
    }
  };

  // 格式化无穷大值
  const formatInfinity = (value: number): string => {
    if (value === Infinity) return '∞';
    if (value === -Infinity) return '-∞';
    return value.toFixed(4);
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>单样本均值假设检验</Text>
      
      <Card mb={6}>
        <CardBody>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
            {/* 原假设均值 */}
            <FormControl>
              <FormLabel>原假设均值 (μ₀)</FormLabel>
              <Input 
                type="number" 
                value={mu0} 
                onChange={(e) => setMu0(parseFloat(e.target.value) || 0)} 
                placeholder="输入原假设均值"
              />
            </FormControl>

            {/* 显著性水平 */}
            <FormControl>
              <FormLabel>显著性水平 (α)</FormLabel>
              <Select 
                value={alpha} 
                onChange={(e) => setAlpha(e.target.value)}
              >
                <option value="0.01">0.01 (99% 置信水平)</option>
                <option value="0.05">0.05 (95% 置信水平)</option>
                <option value="0.10">0.10 (90% 置信水平)</option>
              </Select>
            </FormControl>

            {/* 检验类型 */}
            <FormControl>
              <FormLabel>检验类型</FormLabel>
              <Select 
                value={testType} 
                onChange={(e) => setTestType(e.target.value as 'two' | 'left' | 'right')}
              >
                <option value="two">双侧检验 (μ ≠ μ₀)</option>
                <option value="left">左侧检验 (μ &lt; μ₀)</option>
                <option value="right">右侧检验 (μ &gt; μ₀)</option>
              </Select>
            </FormControl>

            {/* 方差类型 */}
            <FormControl>
              <FormLabel>方差情况</FormLabel>
              <Select 
                value={varianceType} 
                onChange={(e) => setVarianceType(e.target.value as 'known' | 'unknown')}
              >
                <option value="known">方差已知</option>
                <option value="unknown">方差未知</option>
              </Select>
            </FormControl>

            {/* 总体标准差（当方差已知时显示） */}
            {varianceType === 'known' && (
              <FormControl>
                <FormLabel>总体标准差 (σ)</FormLabel>
                <Input 
                  type="number" 
                  min="0" 
                  step="any" 
                  value={sigma} 
                  onChange={(e) => setSigma(parseFloat(e.target.value) || 0)} 
                  placeholder="输入总体标准差"
                />
              </FormControl>
            )}
          </Grid>

          <Button 
            onClick={handleTest} 
            mt={4} 
            colorScheme="blue" 
            size="lg"
          >
            执行假设检验
          </Button>
        </CardBody>
        </Card>

      {/* 错误提示 */}
      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      )}

      {/* 检验结果 */}
      {testResult && (
        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={4}>检验结果</Text>
            
            <Stack spacing={3}>
              <Box>
                <Text fontWeight="bold">检验方法：</Text>
                <Text>{testResult.method}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">假设：</Text>
                <Text>H₀: μ = {mu0}</Text>
                <Text>H₁: {testType === 'two' ? 'μ ≠ ' : testType === 'left' ? 'μ < ' : 'μ > '}{mu0}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">样本统计量：</Text>
                <Text>样本均值 = {testResult.mean.toFixed(4)}</Text>
                {testResult.testType === 't-test' && (
                  <Text>样本标准差 = {testResult.std.toFixed(4)}</Text>
                )}
                <Text>样本量 = {dataset.length}</Text>
                {testResult.testType === 't-test' && (
                  <Text>自由度 = {testResult.df}</Text>
                )}

              </Box>
              
              <Box>
                <Text fontWeight="bold">检验统计量：</Text>
                <Text>{testResult.testType === 'Z-test' ? 'Z值' : 't值'} = {testResult.testType === 'Z-test' ? testResult.zValue.toFixed(4) : testResult.tValue.toFixed(4)}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">临界值：</Text>
                <Text>{testResult.testType === 'Z-test' ? 'Z' : 't'}{testType === 'two' ? 'α/2' : 'α'} = {testResult.criticalValue.toFixed(4)}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">p值：</Text>
                <Text>{testResult.pValue.toFixed(6)}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">置信区间：</Text>
                {testResult.confidenceInterval && (
                  <Text>[{formatInfinity(testResult.confidenceInterval.lower)}, {formatInfinity(testResult.confidenceInterval.upper)}]</Text>
                )}
              </Box>
              
              <Box>
                <Text fontWeight="bold">结论：</Text>
                <Text color={testResult.rejected ? "red.600" : "green.600"}>
                  {testResult.rejected 
                    ? `在显著性水平 α = ${alpha} 下，拒绝原假设 H₀` 
                    : `在显著性水平 α = ${alpha} 下，不拒绝原假设 H₀`
                  }
                </Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">决策依据：</Text>
                <Text>p值方法：{testResult.pValue <= parseFloat(alpha) ? 'p值 ≤ α，拒绝 H₀' : 'p值 > α，不拒绝 H₀'}</Text>
                <Text>临界值方法：{testResult.rejected ? '检验统计量落在拒绝域，拒绝 H₀' : '检验统计量未落在拒绝域，不拒绝 H₀'}</Text>
                {testResult.confidenceInterval && (
                  <Text>置信区间方法：{testResult.rejected ? `μ₀ = ${mu0} 不在置信区间内，拒绝 H₀` : `μ₀ = ${mu0} 在置信区间内，不拒绝 H₀`}</Text>
                )}

              </Box>
            </Stack>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default HypothesisTestingTab;