import { useState, useEffect } from 'react';
import { Box, Text, Grid, GridItem, Card, CardBody, Select, FormControl, FormLabel, Switch, NumberInput } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BasicStatisticsTabProps, BasicStats } from '../types';
import { generateHistogramData, calculateConfidenceInterval, calculateMean, calculateMedian, calculateMode, calculateVariance, calculateStd, calculateQuartiles } from '../utils/statistics';

function BasicStatisticsTab({ dataset, basicStats: propsBasicStats }: BasicStatisticsTabProps & { basicStats?: BasicStats | null }) {
  const [stats, setStats] = useState<{
    mean: number;
    median: number;
    mode: number[];
    variance: number;
    std: number;
    min: number;
    max: number;
    range: number;
    q1: number;
    q3: number;
    iqr: number;
    confidenceInterval: { 
      lower: number; 
      upper: number; 
      marginOfError: number;
      method: string;
      criticalValue: number;
    };
  } | null>(null);
  
  // 置信区间计算选项
  const [ciOptions, setCiOptions] = useState({
    confidenceLevel: 0.95,
    isNormal: false,
    knownVariance: false,
    populationVariance: 0
  });
  
  const [histogramData, setHistogramData] = useState<{ name: string; value: number }[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<{ index: number; value: number }[]>([]);

  useEffect(() => {
    if (dataset && dataset.length > 0) {
      calculateStats(dataset);
      createHistogramData(dataset);
      generateTimeSeriesData(dataset);
    }
  }, [dataset, ciOptions, propsBasicStats]);

  const calculateStats = (data: number[]) => {
    // 优先使用传入的统计量
    if (propsBasicStats) {
      const sortedData = [...data].sort((a, b) => a - b);
      const n = sortedData.length;
      const { q1, q3, iqr } = calculateQuartiles(data);
      
      // 计算置信区间
      const confidenceInterval = calculateConfidenceInterval(data, ciOptions.confidenceLevel, {
        isNormal: ciOptions.isNormal,
        knownVariance: ciOptions.knownVariance,
        populationVariance: ciOptions.populationVariance
      });
      
      // 计算最小值、最大值和范围
      const min = sortedData[0];
      const max = sortedData[n - 1];
      const range = max - min;
      
      setStats({
        mean: propsBasicStats.mean || 0,
        median: propsBasicStats.median || 0,
        mode: propsBasicStats.mode ? (Array.isArray(propsBasicStats.mode) ? propsBasicStats.mode : [propsBasicStats.mode]) : [],
        variance: propsBasicStats.variance || (propsBasicStats.std ? propsBasicStats.std * propsBasicStats.std : 0),
        std: propsBasicStats.std || 0,
        min,
        max,
        range,
        q1,
        q3,
        iqr,
        confidenceInterval
      });
    } else {
      const sortedData = [...data].sort((a, b) => a - b);
      const n = sortedData.length;
      
      // 使用共享的统计函数
      const mean = calculateMean(data);
      const median = calculateMedian(data);
      const mode = calculateMode(data);
      const variance = calculateVariance(data);
      const std = calculateStd(data);
      const { q1, q3, iqr } = calculateQuartiles(data);
      
      // 计算置信区间
      const confidenceInterval = calculateConfidenceInterval(data, ciOptions.confidenceLevel, {
        isNormal: ciOptions.isNormal,
        knownVariance: ciOptions.knownVariance,
        populationVariance: ciOptions.populationVariance
      });
      
      // 计算最小值、最大值和范围
      const min = sortedData[0];
      const max = sortedData[n - 1];
      const range = max - min;
      
      setStats({
        mean,
        median,
        mode,
        variance,
        std,
        min,
        max,
        range,
        q1,
        q3,
        iqr,
        confidenceInterval
      });
    }
  };
  
  const handleCIOptionChange = (field: string, value: any) => {
    setCiOptions(prev => ({
      ...prev,
      [field]: value
    }));
    // 重新计算统计量
    if (dataset && dataset.length > 0) {
      calculateStats(dataset);
    }
  };

  const createHistogramData = (data: number[]) => {
    const histogramData = generateHistogramData(data);
    setHistogramData(histogramData);
  };

  const generateTimeSeriesData = (data: number[]) => {
    const timeData = data.map((value, index) => ({
      index,
      value,
    }));
    setTimeSeriesData(timeData);
  };

  if (!stats) {
    return <Text>计算统计数据中...</Text>;
  }

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={6}>基本统计分析结果</Text>
      
      {/* 置信区间选项设置 */}
      <Box mb={6} p={4} borderWidth={1} borderRadius={4} bgColor="#f5f5f5">
        <Text fontSize="lg" fontWeight="bold" mb={4}>置信区间计算设置</Text>
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
          <FormControl>
            <FormLabel>置信水平</FormLabel>
            <Select 
              value={ciOptions.confidenceLevel} 
              onChange={(e) => handleCIOptionChange('confidenceLevel', parseFloat(e.target.value))}
            >
              <option value={0.90}>90%</option>
              <option value={0.95}>95%</option>
              <option value={0.99}>99%</option>
            </Select>
          </FormControl>
          
          <FormControl>
            <FormLabel>分布假设</FormLabel>
            <Select 
              value={ciOptions.isNormal ? 'normal' : 'nonNormal'} 
              onChange={(e) => handleCIOptionChange('isNormal', e.target.value === 'normal')}
            >
              <option value="normal">正态分布</option>
              <option value="nonNormal">非正态分布</option>
            </Select>
          </FormControl>
          
          <FormControl>
            <FormLabel>方差已知</FormLabel>
            <Switch 
              isChecked={ciOptions.knownVariance}
              onChange={(e) => handleCIOptionChange('knownVariance', e.target.checked)}
            />
          </FormControl>
          
          {ciOptions.knownVariance && (
            <FormControl>
              <FormLabel>总体方差值</FormLabel>
              <NumberInput
                min={0}
                step={0.0001}
                value={ciOptions.populationVariance}
                onChange={(value) => handleCIOptionChange('populationVariance', parseFloat(value || '0'))}
              />
            </FormControl>
          )}
        </Grid>
      </Box>
      
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} mb={8}>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">均值</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.mean !== undefined ? stats.mean.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">中位数</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.median !== undefined ? stats.median.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">众数</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.mode && stats.mode.length > 0 ? stats.mode.map(m => typeof m === 'number' ? m.toFixed(4) : m).join(', ') : '无众数'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">标准差</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.std !== undefined ? stats.std.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">最小值</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.min !== undefined ? stats.min.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">最大值</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.max !== undefined ? stats.max.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">四分位距</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.iqr !== undefined ? stats.iqr.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">样本大小</Text>
            <Text fontSize="2xl" fontWeight="bold">{dataset && dataset.length !== undefined ? dataset.length : 0}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">{Math.round(ciOptions.confidenceLevel * 100)}% 置信区间下限</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.confidenceInterval?.lower !== undefined ? stats.confidenceInterval.lower.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">{Math.round(ciOptions.confidenceLevel * 100)}% 置信区间上限</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.confidenceInterval?.upper !== undefined ? stats.confidenceInterval.upper.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">边际误差</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.confidenceInterval?.marginOfError !== undefined ? stats.confidenceInterval.marginOfError.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">计算方法</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.confidenceInterval?.method || 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">临界值</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.confidenceInterval?.criticalValue !== undefined ? stats.confidenceInterval.criticalValue.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
      </Grid>
      
      <Grid templateColumns="1fr 1fr" gap={6}>
        <GridItem>
          <Text fontSize="lg" fontWeight="bold" mb={4}>直方图</Text>
          <Box height="400px" width="100%">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
        
        <GridItem>
          <Text fontSize="lg" fontWeight="bold" mb={4}>时间序列图</Text>
          <Box height="400px" width="100%">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" label={{ value: '索引', position: 'insideBottomRight', offset: -10 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default BasicStatisticsTab;