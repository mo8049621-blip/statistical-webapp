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
  
  // Confidence interval calculation options
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
    // Prefer using passed statistics
    if (propsBasicStats) {
      const sortedData = [...data].sort((a, b) => a - b);
      const n = sortedData.length;
      const { q1, q3, iqr } = calculateQuartiles(data);
      
      // Calculate confidence interval
      const confidenceInterval = calculateConfidenceInterval(data, ciOptions.confidenceLevel, {
        isNormal: ciOptions.isNormal,
        knownVariance: ciOptions.knownVariance,
        populationVariance: ciOptions.populationVariance
      });
      
      // Calculate minimum, maximum, and range
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
      
      // Use shared statistical functions
      const mean = calculateMean(data);
      const median = calculateMedian(data);
      const mode = calculateMode(data);
      const variance = calculateVariance(data);
      const std = calculateStd(data);
      const { q1, q3, iqr } = calculateQuartiles(data);
      
      // Calculate confidence interval
      const confidenceInterval = calculateConfidenceInterval(data, ciOptions.confidenceLevel, {
        isNormal: ciOptions.isNormal,
        knownVariance: ciOptions.knownVariance,
        populationVariance: ciOptions.populationVariance
      });
      
      // Calculate minimum, maximum, and range
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
    // Recalculate statistics
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
    return <Text>Calculating statistics...</Text>;
  }

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={6}>Basic Statistical Analysis Results</Text>
      
      {/* Confidence Interval Settings */}
      <Box mb={6} p={4} borderWidth={1} borderRadius={4} bgColor="#f5f5f5">
        <Text fontSize="lg" fontWeight="bold" mb={4}>Confidence Interval Settings</Text>
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
          <FormControl>
            <FormLabel>Confidence Level</FormLabel>
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
            <FormLabel>Distribution Assumption</FormLabel>
            <Select 
              value={ciOptions.isNormal ? 'normal' : 'nonNormal'} 
              onChange={(e) => handleCIOptionChange('isNormal', e.target.value === 'normal')}
            >
              <option value="normal">Normal Distribution</option>
              <option value="nonNormal">Non-Normal Distribution</option>
            </Select>
          </FormControl>
          
          <FormControl>
            <FormLabel>Known Variance</FormLabel>
            <Switch 
              isChecked={ciOptions.knownVariance}
              onChange={(e) => handleCIOptionChange('knownVariance', e.target.checked)}
            />
          </FormControl>
          
          {ciOptions.knownVariance && (
            <FormControl>
              <FormLabel>Population Variance Value</FormLabel>
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
            <Text fontSize="sm" color="gray.500">Mean</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.mean !== undefined ? stats.mean.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">Median</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.median !== undefined ? stats.median.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">Mode</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.mode && stats.mode.length > 0 ? stats.mode.map(m => typeof m === 'number' ? m.toFixed(4) : m).join(', ') : 'No mode'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">Standard Deviation</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.std !== undefined ? stats.std.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">Minimum</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.min !== undefined ? stats.min.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">Maximum</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.max !== undefined ? stats.max.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">Interquartile Range</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.iqr !== undefined ? stats.iqr.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">Sample Size</Text>
            <Text fontSize="2xl" fontWeight="bold">{dataset && dataset.length !== undefined ? dataset.length : 0}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">{Math.round(ciOptions.confidenceLevel * 100)}% CI Lower Bound</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.confidenceInterval?.lower !== undefined ? stats.confidenceInterval.lower.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">{Math.round(ciOptions.confidenceLevel * 100)}% CI Upper Bound</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.confidenceInterval?.upper !== undefined ? stats.confidenceInterval.upper.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">Margin of Error</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.confidenceInterval?.marginOfError !== undefined ? stats.confidenceInterval.marginOfError.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">Calculation Method</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.confidenceInterval?.method || 'N/A'}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="sm" color="gray.500">Critical Value</Text>
            <Text fontSize="2xl" fontWeight="bold">{stats.confidenceInterval?.criticalValue !== undefined ? stats.confidenceInterval.criticalValue.toFixed(4) : 'N/A'}</Text>
          </CardBody>
        </Card>
      </Grid>
      
      <Grid templateColumns="1fr 1fr" gap={6}>
        <GridItem>
          <Text fontSize="lg" fontWeight="bold" mb={4}>Histogram</Text>
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
          <Text fontSize="lg" fontWeight="bold" mb={4}>Time Series Plot</Text>
          <Box height="400px" width="100%">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" label={{ value: 'Index', position: 'insideBottomRight', offset: -10 }} />
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