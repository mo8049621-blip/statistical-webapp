import { useState } from 'react';
import { Box, Text, Grid, Card, CardBody, Select, FormControl, FormLabel, Button, Input, Alert, AlertDescription } from '@chakra-ui/react';
import { calculateTwoSampleConfidenceInterval } from '../utils/statistics';

const TwoSampleCIComponent = () => {
  const [data1, setData1] = useState<string>('');
  const [data2, setData2] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95);
  const [method, setMethod] = useState<'pooled' | 'welch' | 'paired'>('welch');
  const [result, setResult] = useState<{
    lower: number;
    upper: number;
    marginOfError: number;
    method: string;
    criticalValue: number;
    meanDiff: number;
    mean1: number;
    mean2: number;
    n1: number;
    n2: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseData = (input: string): number[] => {
    // 尝试多种格式解析：逗号分隔、空格分隔、换行分隔
    try {
      // 首先尝试直接解析为JSON数组
      if (input.trim().startsWith('[') && input.trim().endsWith(']')) {
        return JSON.parse(input);
      }
      // 否则按逗号、空格、换行等分隔符解析
      return input
        .split(/[,\s\n]+/)
        .filter(item => item.trim() !== '')
        .map(item => parseFloat(item.trim()))
        .filter(num => !isNaN(num));
    } catch (e) {
      throw new Error('数据格式错误，请输入有效的数字列表');
    }
  };

  const calculate = () => {
    setError(null);
    setResult(null);

    try {
      // 解析输入数据
      const dataset1 = parseData(data1);
      const dataset2 = parseData(data2);

      if (dataset1.length === 0 || dataset2.length === 0) {
        throw new Error('数据集不能为空');
      }

      // 如果是配对样本，检查长度是否相同
      if (method === 'paired' && dataset1.length !== dataset2.length) {
        throw new Error('配对样本的数据集长度必须相同');
      }

      // 计算两个均值之差的置信区间
      const ciResult = calculateTwoSampleConfidenceInterval(dataset1, dataset2, confidenceLevel, { method });

      // 计算样本均值
      const mean1 = dataset1.reduce((sum, val) => sum + val, 0) / dataset1.length;
      const mean2 = dataset2.reduce((sum, val) => sum + val, 0) / dataset2.length;

      setResult({
        ...ciResult,
        mean1,
        mean2,
        n1: dataset1.length,
        n2: dataset2.length
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : '计算过程中发生错误');
    }
  };

  const handleDemoData = () => {
    // 设置示例数据（两组正态分布的样本）
    const demo1 = Array(20).fill(0).map(() => 5 + Math.random() * 2); // 均值约为5的样本
    const demo2 = Array(20).fill(0).map(() => 6 + Math.random() * 2); // 均值约为6的样本
    
    setData1(demo1.join(', '));
    setData2(demo2.join(', '));
    setMethod('welch');
    setConfidenceLevel(0.95);
    setError(null);
    setResult(null);
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>两个均值之差的置信区间</Text>
      
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mb={8}>
        {/* 第一个数据集输入 */}
        <FormControl>
          <FormLabel>数据集1</FormLabel>
          <Text fontSize="sm" color="gray.500" mb={2}>输入逗号分隔或空格分隔的数字列表，例如：1, 2, 3, 4, 5</Text>
          <Input
            as="textarea"
            placeholder="输入第一个数据集的数字..."
            value={data1}
            onChange={(e) => setData1(e.target.value)}
            rows={6}
          />
        </FormControl>

        {/* 第二个数据集输入 */}
        <FormControl>
          <FormLabel>数据集2</FormLabel>
          <Text fontSize="sm" color="gray.500" mb={2}>输入逗号分隔或空格分隔的数字列表，例如：6, 7, 8, 9, 10</Text>
          <Input
            as="textarea"
            placeholder="输入第二个数据集的数字..."
            value={data2}
            onChange={(e) => setData2(e.target.value)}
            rows={6}
          />
        </FormControl>
      </Grid>

      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} mb={6}>
        {/* 置信水平选择 */}
        <FormControl>
          <FormLabel>置信水平</FormLabel>
          <Select 
            value={confidenceLevel} 
            onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
          >
            <option value={0.90}>90%</option>
            <option value={0.95}>95%</option>
            <option value={0.99}>99%</option>
          </Select>
        </FormControl>

        {/* 方法选择 */}
        <FormControl>
          <FormLabel>计算方法</FormLabel>
          <Select 
            value={method} 
            onChange={(e) => setMethod(e.target.value as 'pooled' | 'welch' | 'paired')}
          >
            <option value="pooled">合并方差t检验 (Pooled t)</option>
            <option value="welch">Welch t检验 (方差不等)</option>
            <option value="paired">配对样本t检验</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>&nbsp;</FormLabel>
          <Button 
            colorScheme="blue" 
            width="100%"
            onClick={calculate}
          >
            计算置信区间
          </Button>
        </FormControl>

        <FormControl>
          <FormLabel>&nbsp;</FormLabel>
          <Button 
            variant="outline" 
            width="100%"
            onClick={handleDemoData}
          >
            使用示例数据
          </Button>
        </FormControl>
      </Grid>

      {/* 错误提示 */}
      {error && (
        <Alert status="error" mb={6}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 结果展示 */}
      {result && (
        <>
          <Text fontSize="xl" fontWeight="bold" mb={4}>计算结果</Text>
          
          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} mb={8}>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">数据集1均值</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.mean1.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">数据集2均值</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.mean2.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">均值差</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.meanDiff.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">{Math.round(confidenceLevel * 100)}% 置信区间下限</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.lower.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">{Math.round(confidenceLevel * 100)}% 置信区间上限</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.upper.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">边际误差</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.marginOfError.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">临界值</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.criticalValue.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">样本量1</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.n1}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">样本量2</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.n2}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">计算方法</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.method}</Text>
              </CardBody>
            </Card>
          </Grid>

          <Box p={4} borderWidth={1} borderRadius={4} bgColor="#f0f9ff" mb={4}>
            <Text fontSize="lg" fontWeight="bold" mb={2}>置信区间解释</Text>
            <Text>
              我们有{Math.round(confidenceLevel * 100)}%的信心，认为两个总体均值之差（μ₁ - μ₂）落在区间
              [{result.lower.toFixed(4)}, {result.upper.toFixed(4)}]内。
              {result.lower <= 0 && result.upper >= 0 && (
                <Text mt={2} color="orange.600">
                  注意：由于置信区间包含0，在当前置信水平下，我们不能拒绝两个均值相等的假设。
                </Text>
              )}
              {result.lower > 0 && (
                <Text mt={2} color="green.600">
                  结论：数据集1的总体均值显著大于数据集2的总体均值。
                </Text>
              )}
              {result.upper < 0 && (
                <Text mt={2} color="green.600">
                  结论：数据集1的总体均值显著小于数据集2的总体均值。
                </Text>
              )}
            </Text>
          </Box>
        </>
      )}

      <Box p={4} borderWidth={1} borderRadius={4} bgColor="#f9fafb" mt={8}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>使用说明</Text>
        <Text mb={2}>1. 输入两个数据集，支持多种格式（逗号、空格或换行分隔）</Text>
        <Text mb={2}>2. 选择置信水平（90%、95%或99%）</Text>
        <Text mb={2}>3. 选择合适的计算方法：</Text>
        <Text ml={4} mb={1}>- 合并方差t检验：适用于方差相等的独立样本</Text>
        <Text ml={4} mb={1}>- Welch t检验：适用于方差不等的独立样本</Text>
        <Text ml={4} mb={1}>- 配对样本t检验：适用于相关的配对数据</Text>
        <Text>4. 点击"计算置信区间"按钮查看结果</Text>
      </Box>
    </Box>
  );
};

export default TwoSampleCIComponent;