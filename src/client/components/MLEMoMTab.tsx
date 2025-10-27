import { useState, useEffect } from 'react';
import { Box, Text, Card, CardBody, Grid, Select, Button, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { calculateMLE, calculateMoM } from '../utils/statistics';
import { EstimationResult, BasicStats } from '../types';

interface MLEMoMTabProps {
  dataset: number[];
  distribution: string;
}

function MLEMoMTab({ dataset, distribution, basicStats }: MLEMoMTabProps & { basicStats?: BasicStats | null }) {
  const [selectedDistribution, setSelectedDistribution] = useState<string>('normal');
  const [estimationResults, setEstimationResults] = useState<EstimationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isGeneratedDataset = !!distribution;

  useEffect(() => {
    // 当数据集或分布变化时，自动更新选择的分布
    if (distribution && dataset.length > 0) {
      setSelectedDistribution(distribution);
      handleEstimate();
    }
  }, [dataset, distribution, basicStats]);

  const handleDistributionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistribution(e.target.value);
  };

  const handleEstimate = () => {
    if (dataset.length === 0) {
      setError('请先导入或生成数据');
      return;
    }

    setError(null);
    const results: EstimationResult[] = [];

    try {
      // 计算MLE估计
      const mleParams = calculateMLE(dataset, selectedDistribution, basicStats);
      results.push({
        method: '极大似然估计 (MLE)',
        params: mleParams
      });

      // 计算MoM估计
      const momParams = calculateMoM(dataset, selectedDistribution, basicStats);
      results.push({
        method: '矩估计法 (MoM)',
        params: momParams
      });

      setEstimationResults(results);
    } catch (err) {
      setError(`估计计算失败: ${err instanceof Error ? err.message : '未知错误'}`);
    }
  };

  // 分布选项
  const distributionOptions = [
    { value: 'normal', label: '正态分布' },
    { value: 'exponential', label: '指数分布' },
    { value: 'gamma', label: '伽马分布' },
    { value: 'beta', label: '贝塔分布' },
    { value: 'poisson', label: '泊松分布' },
    { value: 'uniform', label: '均匀分布' }
  ];

  return (
    <Box p={6}>
      <Grid gridTemplateColumns="1fr 2fr" gap={6}>
        <Box>
          <Card>
            <CardBody>
              <Text fontSize="lg" fontWeight="bold" mb={4}>参数估计</Text>
              
              {/* 仅当分布未知时显示手动选择选项 */}
              {!isGeneratedDataset ? (
                <Box mb={4}>
                  <Text mb={2}>选择分布类型：</Text>
                  <Select
                    value={selectedDistribution}
                    onChange={handleDistributionChange}
                    width="full"
                  >
                    {distributionOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Box>
              ) : distribution ? (
                <Box mb={4} bg="blue.50" p={4} borderRadius="md">
                  <Text fontWeight="medium" mb={2}>自动检测结果：</Text>
                  <Text fontSize="sm" mb={1}>分布类型：{distribution}</Text>
                  <Text fontSize="sm" mt={2} color="blue.700">
                    使用{distribution}进行极大似然估计和矩估计
                  </Text>
                </Box>
              ) : null}
              
              <Button
                colorScheme="blue"
                width="full"
                onClick={handleEstimate}
              >
                执行估计
              </Button>
            </CardBody>
          </Card>
        </Box>

        <Box>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {estimationResults.length > 0 && (
            <>
              {estimationResults.map((result, index) => (
                <Card key={index} mb={4}>
                  <CardBody>
                    <Text fontSize="md" fontWeight="bold" mb={2}>
                      {result.method}
                    </Text>
                    <Grid gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                      {Object.entries(result.params).map(([param, value]) => (
                        <Box key={param}>
                          <Text fontSize="sm" color="gray.600">
                            {param}:
                          </Text>
                          <Text fontWeight="bold">
                            {typeof value === 'number' ? value.toFixed(4) : value}
                          </Text>
                        </Box>
                      ))}
                    </Grid>
                  </CardBody>
                </Card>
              ))}
            </>
          )}

          {estimationResults.length === 0 && !error && (
            <Alert status="info">
              <AlertIcon />
              <AlertDescription>请选择分布类型并点击"执行估计"按钮</AlertDescription>
            </Alert>
          )}
        </Box>
      </Grid>
    </Box>
  );
}

export default MLEMoMTab;