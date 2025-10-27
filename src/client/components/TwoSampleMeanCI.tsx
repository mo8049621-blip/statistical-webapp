import { useState, useEffect } from 'react';
import { Box, Text, Grid, Card, CardBody, Select, FormControl, FormLabel, Input, Button, Alert, ButtonGroup } from '@chakra-ui/react';
import { calculateTwoSampleConfidenceInterval } from '../utils/statistics';

interface TwoSampleMeanCIProps {
  dataset1?: number[];
  dataset2?: number[];
}

function TwoSampleMeanCI({ dataset1 = [], dataset2 = [] }: TwoSampleMeanCIProps) {
  // 数据输入状态
  const [sample1Data, setSample1Data] = useState<string>('');
  const [sample2Data, setSample2Data] = useState<string>('');
  
  useEffect(() => {
    if (dataset1.length > 0) {
      setSample1Data(dataset1.join(', '));
    }
    if (dataset2.length > 0) {
      setSample2Data(dataset2.join(', '));
    }
  }, [dataset1, dataset2]);
  
  // 参数输入状态
  const [sample1Size, setSample1Size] = useState<string>('');
  const [sample1Mean, setSample1Mean] = useState<string>('');
  const [sample1Std, setSample1Std] = useState<string>('');
  const [sample2Size, setSample2Size] = useState<string>('');
  const [sample2Mean, setSample2Mean] = useState<string>('');
  const [sample2Std, setSample2Std] = useState<string>('');
  
  // 分析选项
  const [confidenceLevel, setConfidenceLevel] = useState<string>('0.95');
  const [method, setMethod] = useState<'pooled' | 'welch'>('welch');
  const [inputMode, setInputMode] = useState<'data' | 'stats'>('data');
  
  // 结果状态
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 计算两样本均值之差的置信区间
  const calculateTwoSampleCI = (): void => {
    setError(null);
    
    try {
      if (inputMode === 'data') {
        // 从原始数据计算统计量
        const data1 = sample1Data
          .split(/[\s,]+/)
          .filter(val => val.trim() !== '')
          .map(val => parseFloat(val))
          .filter(val => !isNaN(val));
        
        const data2 = sample2Data
          .split(/[\s,]+/)
          .filter(val => val.trim() !== '')
          .map(val => parseFloat(val))
          .filter(val => !isNaN(val));
        
        if (data1.length === 0 || data2.length === 0) {
          throw new Error('两个样本都需要输入有效数据');
        }
        
        const confLevel = parseFloat(confidenceLevel);
        
        // 使用我们的统计函数计算置信区间
        const ciResult = calculateTwoSampleConfidenceInterval(
          data1,
          data2,
          confLevel,
          { method }
        );
        
        setResult(ciResult);
      } else {
        // 统计量输入模式的处理可以后续添加
        throw new Error('统计量输入模式暂未实现');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '计算错误');
    }
  };

  return (
    <Box>
      <Text fontSize="lg" mb={4}>两样本均值之差的置信区间计算</Text>
      
      <Card mb={6}>
        <CardBody>
          <ButtonGroup mb={4} variant="outline" borderBottomWidth="1px" borderBottomColor="gray.200">
            <Button 
              px={4} 
              py={2} 
              variant={inputMode === 'data' ? 'solid' : 'outline'}
              colorScheme="blue"
              onClick={() => setInputMode('data')}
            >
              输入原始数据
            </Button>
            <Button 
              px={4} 
              py={2} 
              variant={inputMode === 'stats' ? 'solid' : 'outline'}
              colorScheme="blue"
              onClick={() => setInputMode('stats')}
            >
              输入统计量
            </Button>
          </ButtonGroup>
          
          {inputMode === 'data' && (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              <FormControl>
                <FormLabel>样本1数据（用空格或逗号分隔）</FormLabel>
                <textarea
                  value={sample1Data}
                  onChange={(e) => setSample1Data(e.target.value)}
                  placeholder="例如: 1.2 3.4 5.6 7.8 9.0"
                  style={{
                    width: '100%',
                    height: '100px',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    resize: 'vertical'
                  }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>样本2数据（用空格或逗号分隔）</FormLabel>
                <textarea
                  value={sample2Data}
                  onChange={(e) => setSample2Data(e.target.value)}
                  placeholder="例如: 2.1 4.3 6.5 8.7 10.9"
                  style={{
                    width: '100%',
                    height: '100px',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    resize: 'vertical'
                  }}
                />
              </FormControl>
            </Grid>
          )}
          
          {inputMode === 'stats' && (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              <Box>
                <Text fontWeight="medium" mb={2}>样本1统计量</Text>
                <FormControl mb={2}>
                  <FormLabel fontSize="sm">样本大小 (n₁)</FormLabel>
                  <Input type="number" value={sample1Size} onChange={(e) => setSample1Size(e.target.value)} min="1" />
                </FormControl>
                <FormControl mb={2}>
                  <FormLabel fontSize="sm">样本均值 (x̄₁)</FormLabel>
                  <Input type="number" step="any" value={sample1Mean} onChange={(e) => setSample1Mean(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">样本标准差 (s₁)</FormLabel>
                  <Input type="number" step="any" value={sample1Std} onChange={(e) => setSample1Std(e.target.value)} min="0" />
                </FormControl>
              </Box>
              
              <Box>
                <Text fontWeight="medium" mb={2}>样本2统计量</Text>
                <FormControl mb={2}>
                  <FormLabel fontSize="sm">样本大小 (n₂)</FormLabel>
                  <Input type="number" value={sample2Size} onChange={(e) => setSample2Size(e.target.value)} min="1" />
                </FormControl>
                <FormControl mb={2}>
                  <FormLabel fontSize="sm">样本均值 (x̄₂)</FormLabel>
                  <Input type="number" step="any" value={sample2Mean} onChange={(e) => setSample2Mean(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">样本标准差 (s₂)</FormLabel>
                  <Input type="number" step="any" value={sample2Std} onChange={(e) => setSample2Std(e.target.value)} min="0" />
                </FormControl>
              </Box>
            </Grid>
          )}
          
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mt={6}>
            <FormControl>
              <FormLabel>置信水平</FormLabel>
              <Select value={confidenceLevel} onChange={(e) => setConfidenceLevel(e.target.value)}>
                <option value="0.90">90%</option>
                <option value="0.95">95%</option>
                <option value="0.99">99%</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>方差处理方法</FormLabel>
              <Select
                value={method}
                onChange={(e) => setMethod(e.target.value as 'pooled' | 'welch')}
              >
                <option value="pooled">假设方差相等（Pooled）</option>
                <option value="welch">不假设方差相等（Welch）</option>
              </Select>
            </FormControl>
          </Grid>
          
          <Button onClick={calculateTwoSampleCI} mt={6} colorScheme="blue" width="100%">
            计算置信区间
          </Button>
        </CardBody>
      </Card>
      
      {error && (
        <Alert status="error" mt={4}>
          {error}
        </Alert>
      )}
      
      {result && (
        <Box mt={6}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>计算结果</Text>
          
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">均值差</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.meanDiff.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">置信区间下限</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.lower.toFixed(4)}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">置信区间上限</Text>
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
                <Text fontSize="sm" color="gray.500">计算方法</Text>
                <Text fontSize="lg" fontWeight="bold">{result.method}</Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.500">临界值</Text>
                <Text fontSize="2xl" fontWeight="bold">{result.criticalValue.toFixed(4)}</Text>
              </CardBody>
            </Card>
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default TwoSampleMeanCI;