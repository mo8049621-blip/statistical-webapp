import { useState, useEffect } from 'react';
import { Button, Box, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Select, VStack, Grid, GridItem, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { DistributionConfig, DistributionGeneratorProps } from '../types';

function DistributionGenerator({ onDataChange }: DistributionGeneratorProps) {
  const [sampleSize, setSampleSize] = useState<number>(1000);
  const [selectedDistribution, setSelectedDistribution] = useState<string>('normal');
  const [params, setParams] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 定义各种分布的配置
  const distributionConfigs: Record<string, DistributionConfig> = {
    normal: {
      name: '正态分布',
      params: [
        { name: 'mean', label: '均值 (μ)', min: -100, max: 100, step: 0.1, defaultValue: 0 },
        { name: 'std', label: '标准差 (σ)', min: 0.1, max: 20, step: 0.1, defaultValue: 1 },
      ],
      formula: 'f(x) = (1/(σ√(2π))) * e^(-(x-μ)²/(2σ²))',
    },
    uniform: {
      name: '均匀分布',
      params: [
        { name: 'a', label: '最小值 (a)', min: -100, max: 100, step: 0.1, defaultValue: 0 },
        { name: 'b', label: '最大值 (b)', min: -100, max: 100, step: 0.1, defaultValue: 1 },
      ],
      formula: 'f(x) = 1/(b-a) 当 a ≤ x ≤ b 时',
    },
    binomial: {
      name: '二项分布',
      params: [
        { name: 'n', label: '试验次数 (n)', min: 1, max: 100, step: 1, defaultValue: 10 },
        { name: 'p', label: '成功概率 (p)', min: 0.1, max: 0.9, step: 0.01, defaultValue: 0.5 },
      ],
      formula: 'P(k) = C(n,k) * p^k * (1-p)^(n-k)',
    },
    poisson: {
      name: '泊松分布',
      params: [
        { name: 'lambda', label: 'λ 参数', min: 0.1, max: 20, step: 0.1, defaultValue: 5 },
      ],
      formula: 'P(k) = (e^(-λ) * λ^k) / k!',
    },
    exponential: {
      name: '指数分布',
      params: [
        { name: 'lambda', label: 'λ 参数', min: 0.1, max: 5, step: 0.1, defaultValue: 1 },
      ],
      formula: 'f(x) = λ * e^(-λx) 当 x ≥ 0 时',
    },
    gamma: {
      name: '伽马分布',
      params: [
        { name: 'shape', label: '形状参数 (k)', min: 0.1, max: 10, step: 0.1, defaultValue: 2 },
        { name: 'scale', label: '尺度参数 (θ)', min: 0.1, max: 5, step: 0.1, defaultValue: 1 },
      ],
      formula: 'f(x) = (x^(k-1) * e^(-x/θ)) / (θ^k * Γ(k)) 当 x > 0 时',
    },
  };

  // 初始化参数
  useEffect(() => {
    const config = distributionConfigs[selectedDistribution];
    const initialParams: Record<string, number> = {};
    config.params.forEach((param) => {
      initialParams[param.name] = param.defaultValue;
    });
    setParams(initialParams);
  }, [selectedDistribution]);

  const handleParamChange = (paramName: string, value: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      [paramName]: value,
    }));
  };

  const generateMockData = (): number[] => {
    const data: number[] = [];
    
    switch (selectedDistribution) {
      case 'normal':
        for (let i = 0; i < sampleSize; i++) {
          const u1 = Math.random();
          const u2 = Math.random();
          const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          data.push(params.mean + params.std * z);
        }
        break;
      
      case 'uniform':
        const a = params.a;
        const b = params.b;
        for (let i = 0; i < sampleSize; i++) {
          data.push(a + Math.random() * (b - a));
        }
        break;
      
      case 'binomial':
        const n = params.n;
        const p = params.p;
        for (let i = 0; i < sampleSize; i++) {
          let successes = 0;
          for (let j = 0; j < n; j++) {
            if (Math.random() < p) {
              successes++;
            }
          }
          data.push(successes);
        }
        break;
      
      case 'poisson':
        const lambda = params.lambda;
        for (let i = 0; i < sampleSize; i++) {
          let k = 0;
          let p = 1;
          const l = Math.exp(-lambda);
          do {
            k++;
            p *= Math.random();
          } while (p > l);
          data.push(k - 1);
        }
        break;
      
      case 'exponential':
        const expLambda = params.lambda;
        for (let i = 0; i < sampleSize; i++) {
          data.push(-Math.log(Math.random()) / expLambda);
        }
        break;
      
      case 'gamma':
        const shape = params.shape;
        const scale = params.scale;
        for (let i = 0; i < sampleSize; i++) {
          // 使用Marsaglia和Tsang的方法生成伽马分布随机数
          if (shape < 1) {
            // 修复：使用接受-拒绝法代替递归调用
            const k = shape;
            const c = (1 / k) - 1;
            let x, u;
            do {
              x = Math.pow(Math.random(), 1 / k);
              u = Math.random();
            } while (u > Math.exp(-x + c * (x - 1)));
            data.push(x * scale);
          } else {
            const d = shape - 1 / 3;
            const c = 1 / Math.sqrt(9 * d);
            let x, v, u;
            do {
              do {
                x = Math.random();
                v = 1 + c * x;
              } while (v <= 0);
              v = Math.pow(v, 3);
              u = Math.random();
            } while (u >= 1 - 0.0331 * Math.pow(x, 4) && Math.log(u) >= 0.5 * Math.pow(x, 2) + d * (1 - v + Math.log(v)));
            data.push(d * v * scale);
          }
        }
        break;
      
      default:
        throw new Error('不支持的分布类型');
    }
    
    return data;
  };

  const handleGenerate = () => {
    try {
      setErrorMessage('');
      
      // 验证参数
      if (selectedDistribution === 'uniform' && params.a >= params.b) {
        throw new Error('均匀分布的最小值必须小于最大值');
      }
      
      // 使用setTimeout模拟异步操作，但不使用async/await
      setTimeout(() => {
        try {
          const data = generateMockData();
          const config = distributionConfigs[selectedDistribution];
          
          onDataChange(data, {
            type: selectedDistribution,
            name: config.name,
            formula: config.formula,
            parameters: { ...params },
          });
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : '生成数据时发生错误'
          );
        }
      }, 300);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '生成数据时发生错误'
      );
    }
  };

  const currentConfig = distributionConfigs[selectedDistribution];

  return (
    <Box p={4}>
      <Grid templateColumns="1fr 1fr" gap={6}>
        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text mb={2} fontWeight="bold">选择分布类型</Text>
              <Select
                value={selectedDistribution}
                onChange={(e) => setSelectedDistribution(e.target.value)}
              >
                {Object.entries(distributionConfigs).map(([key, config]) => (
                  <option key={key} value={key}>{config.name}</option>
                ))}
              </Select>
            </Box>
            
            <Box>
              <Text mb={2} fontWeight="bold">样本大小: {sampleSize}</Text>
              <Slider
                min={10}
                max={10000}
                step={10}
                value={sampleSize}
                onChange={(val) => setSampleSize(val)}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
            
            {currentConfig.params.map((param) => (
              <Box key={param.name}>
                <Text mb={2} fontWeight="bold">{param.label}: {params[param.name]}</Text>
                <Slider
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={params[param.name] || param.defaultValue}
                  onChange={(val) => handleParamChange(param.name, val)}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            ))}
            
            <Button
              onClick={handleGenerate}
              colorScheme="blue"
              variant="solid"
              size="lg"
            >
              生成数据
            </Button>
            
            {errorMessage && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </VStack>
        </GridItem>
        
        <GridItem>
          <Box p={4} bg="gray.50" borderRadius="md" height="100%">
            <Text fontWeight="bold" fontSize="lg" mb={2}>
              {currentConfig.name}
            </Text>
            
            {currentConfig.formula && (
              <Box mb={4} p={2} bg="white" borderRadius="md">
                <Text fontFamily="monospace" fontSize="sm">
                  {currentConfig.formula}
                </Text>
              </Box>
            )}
            
            <Text fontWeight="bold" mb={2}>参数说明:</Text>
            {currentConfig.params.map((param) => (
              <Text key={param.name} fontSize="sm" mb={1}>
                <strong>{param.label}:</strong> {param.name === 'mean' ? '分布的中心位置' : 
                 param.name === 'std' ? '分布的离散程度' : 
                 param.name === 'a' ? '区间的最小值' : 
                 param.name === 'b' ? '区间的最大值' : 
                 param.name === 'n' ? '独立试验的次数' : 
                 param.name === 'p' ? '每次试验成功的概率' : 
                 param.name === 'lambda' ? '单位时间内事件发生的平均次数' : 
                 param.name === 'shape' ? '形状参数，影响分布的形状' : 
                 param.name === 'scale' ? '尺度参数，影响分布的范围' : ''}
              </Text>
            ))}
            
            <Box mt={6}>
              <Text fontWeight="bold" mb={2}>使用说明:</Text>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                <li style={{ fontSize: 'sm', marginBottom: '4px' }}>选择分布类型</li>
                <li style={{ fontSize: 'sm', marginBottom: '4px' }}>调整样本大小</li>
                <li style={{ fontSize: 'sm', marginBottom: '4px' }}>设置分布参数</li>
                <li style={{ fontSize: 'sm', marginBottom: '4px' }}>点击"生成数据"按钮</li>
              </ul>
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default DistributionGenerator;