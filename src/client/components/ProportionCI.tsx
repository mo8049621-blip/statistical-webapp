import { useState, useEffect } from 'react';
import { Box, Text, FormControl, FormLabel, Input, Select, Button, Card, CardBody, Grid, Alert } from '@chakra-ui/react';
import { calculateProportionConfidenceInterval } from '../utils/statistics';

interface ProportionCIProps {
  dataset?: number[];
}

function ProportionCI({ dataset = [] }: ProportionCIProps) {
  // 单比例参数
  const [successCount, setSuccessCount] = useState<string>('');
  const [sampleSize, setSampleSize] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<string>('0.95');
  const [method, setMethod] = useState<'wald' | 'wilson'>('wilson');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // 如果有传入数据集，自动计算成功次数和样本大小
    if (dataset.length > 0) {
      // 假设数据集是二元的（0和1），计算1的数量作为成功次数
      const count = dataset.filter(value => value === 1).length;
      setSuccessCount(count.toString());
      setSampleSize(dataset.length.toString());
    }
  }, [dataset]);

  const handleCalculate = () => {
    setError(null);
    try {
      const y = parseInt(successCount);
      const n = parseInt(sampleSize);
      const cl = parseFloat(confidenceLevel);
      
      if (isNaN(y) || isNaN(n) || isNaN(cl) || y < 0 || n <= 0 || y > n) {
        throw new Error('请输入有效的成功次数和样本大小');
      }
      
      const result = calculateProportionConfidenceInterval(y, n, cl, { method });
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '计算错误');
    }
  };

  return (
    <Box>
      <Text fontSize="lg" mb={6}>单比例置信区间计算</Text>
          
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={6}>
        <FormControl>
          <FormLabel fontSize="sm">成功次数 (y)</FormLabel>
          <Input
            type="number"
            value={successCount}
            onChange={(e) => setSuccessCount(e.target.value)}
            min="0"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">样本大小 (n)</FormLabel>
          <Input
            type="number"
            value={sampleSize}
            onChange={(e) => setSampleSize(e.target.value)}
            min="1"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">置信水平</FormLabel>
          <Select
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(e.target.value)}
          >
            <option value="0.90">90%</option>
            <option value="0.95">95%</option>
            <option value="0.99">99%</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">计算方法</FormLabel>
          <Select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'wald' | 'wilson')}
          >
            <option value="wald">Wald 区间</option>
            <option value="wilson">Wilson 得分区间</option>
          </Select>
        </FormControl>
      </Grid>
      
      <Button onClick={handleCalculate} colorScheme="blue" width="100%" mb={6}>
        计算置信区间
      </Button>
      
      {error && (
        <Alert status="error" mt={4}>
          {error}
        </Alert>
      )}
      
      {results && (
        <Card>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={4}>
              <Card>
                <CardBody>
                  <Text fontSize="sm" color="gray.500">样本比例 (p̂)</Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {results.proportion !== undefined ? results.proportion.toFixed(4) : 'N/A'}
                  </Text>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Text fontSize="sm" color="gray.500">标准误</Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {results.standardError !== undefined ? results.standardError.toFixed(4) : 'N/A'}
                  </Text>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Text fontSize="sm" color="gray.500">边际误差</Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {results.marginOfError !== undefined ? results.marginOfError.toFixed(4) : 'N/A'}
                  </Text>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Text fontSize="sm" color="gray.500">计算方法</Text>
                  <Text fontSize="lg" fontWeight="bold">{results.method || 'N/A'}</Text>
                </CardBody>
              </Card>
            </Grid>
            
            <Box mt={4}>
              <Text fontSize="sm" color="gray.600">
                {confidenceLevel === '0.95' ? '95%' : confidenceLevel === '0.90' ? '90%' : '99%'} 置信区间:
              </Text>
              <Text fontWeight="bold" fontSize="lg">
                [
                {results.lower !== undefined ? results.lower.toFixed(4) : 'N/A'},
                {results.upper !== undefined ? results.upper.toFixed(4) : 'N/A'}
                ]
              </Text>
            </Box>
          </CardBody>
        </Card>
      )}
    </Box>
  );
}

export default ProportionCI;