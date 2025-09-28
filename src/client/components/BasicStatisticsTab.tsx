import { useState, useEffect } from 'react';
import { Box, Text, Grid, GridItem, Card, CardBody } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BasicStatisticsTabProps } from '../types';
import { calculateMean, calculateMedian, calculateMode, calculateVariance, calculateStd, calculateQuartiles, generateHistogramData as utilsGenerateHistogramData } from '../utils/statistics';

function BasicStatisticsTab({ dataset }: BasicStatisticsTabProps) {
  const [stats, setStats] = useState<{
    mean: number;
    median: number;
    mode: number | null;
    variance: number;
    std: number;
    min: number;
    max: number;
    range: number;
    q1: number;
    q3: number;
    iqr: number;
  } | null>(null);
  
  const [histogramData, setHistogramData] = useState<{ name: string; value: number }[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<{ index: number; value: number }[]>([]);

  useEffect(() => {
    if (dataset && dataset.length > 0) {
      calculateStats(dataset);
      generateHistogramData(dataset);
      generateTimeSeriesData(dataset);
    }
  }, [dataset]);

  const calculateStats = (data: number[]) => {
    const sortedData = [...data].sort((a, b) => a - b);
    const n = sortedData.length;
    
    // 使用共享的统计函数
    const mean = calculateMean(data);
    const median = calculateMedian(data);
    const mode = calculateMode(data);
    const variance = calculateVariance(data);
    const std = calculateStd(data);
    const { q1, q3, iqr } = calculateQuartiles(data);
    
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
    });
  };

  const generateHistogramData = (data: number[]) => {
    const histogramData = utilsGenerateHistogramData(data);
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
      
      <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4} mb={8}>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">均值</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.mean.toFixed(4)}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">中位数</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.median.toFixed(4)}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">众数</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.mode !== null ? stats.mode.toFixed(4) : '无唯一众数'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">标准差</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.std.toFixed(4)}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">最小值</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.min.toFixed(4)}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">最大值</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.max.toFixed(4)}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">四分位距</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.iqr.toFixed(4)}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">样本大小</Text>
            <Text fontSize="2xl" fontWeight="bold">{dataset.length}</Text>
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