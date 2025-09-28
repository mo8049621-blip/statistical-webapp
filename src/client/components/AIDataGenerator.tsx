import { useState } from 'react';
import { Button, Box, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, VStack, Alert, AlertIcon, AlertDescription, Textarea } from '@chakra-ui/react';
import { AIDataGeneratorProps } from '../types';

function AIDataGenerator({ onDataChange }: AIDataGeneratorProps) {
  const [sampleSize, setSampleSize] = useState<number>(1000);
  const [dataDescription, setDataDescription] = useState<string>('生成符合正态分布的随机数据');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleGenerate = () => {
    if (!dataDescription.trim()) {
      setErrorMessage('请输入数据描述');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');

    // 模拟AI生成数据的过程
    // 注意：在实际应用中，这里应该调用真正的AI API
    setTimeout(() => {
      try {
        // 由于没有真正的AI API，我们将根据描述生成模拟数据
        const data = generateMockDataBasedOnDescription(dataDescription, sampleSize);
        
        onDataChange(data, {
          type: 'ai',
          name: 'AI生成数据',
          parameters: { 
            sampleSize,
            // 将描述转换为字符串长度作为数值参数，避免类型错误
            descriptionLength: dataDescription.length 
          }
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : '生成数据时发生错误'
        );
      } finally {
        setIsGenerating(false);
      }
    }, 2000); // 模拟2秒的生成时间
  };

  const generateMockDataBasedOnDescription = (description: string, size: number): number[] => {
    const data: number[] = [];
    const lowerCaseDescription = description.toLowerCase();
    
    // 根据描述中的关键词生成相应分布的数据
    if (lowerCaseDescription.includes('正态') || lowerCaseDescription.includes('normal')) {
      // 正态分布数据
      const mean = 0;
      const std = 1;
      for (let i = 0; i < size; i++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        data.push(mean + std * z);
      }
    } else if (lowerCaseDescription.includes('均匀') || lowerCaseDescription.includes('uniform')) {
      // 均匀分布数据
      const a = 0;
      const b = 1;
      for (let i = 0; i < size; i++) {
        data.push(a + Math.random() * (b - a));
      }
    } else if (lowerCaseDescription.includes('指数') || lowerCaseDescription.includes('exponential')) {
      // 指数分布数据
      const lambda = 1;
      for (let i = 0; i < size; i++) {
        data.push(-Math.log(Math.random()) / lambda);
      }
    } else if (lowerCaseDescription.includes('二项') || lowerCaseDescription.includes('binomial')) {
      // 二项分布数据
      const n = 10;
      const p = 0.5;
      for (let i = 0; i < size; i++) {
        let successes = 0;
        for (let j = 0; j < n; j++) {
          if (Math.random() < p) {
            successes++;
          }
        }
        data.push(successes);
      }
    } else {
      // 默认生成正态分布数据
      const mean = 0;
      const std = 1;
      for (let i = 0; i < size; i++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        data.push(mean + std * z);
      }
    }
    
    return data;
  };

  return (
    <Box p={4}>
      <VStack align="stretch" spacing={4}>
        <Box>
          <Text mb={2} fontWeight="bold">数据描述</Text>
          <Textarea
            value={dataDescription}
            onChange={(e) => setDataDescription(e.target.value)}
            placeholder="请描述您想要生成的数据特征，例如：生成符合正态分布的随机数据" 
            rows={4}
          />
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
        
        <Button
          onClick={handleGenerate}
          colorScheme="blue"
          variant="solid"
          size="lg"
          isLoading={isGenerating}
          loadingText="生成中..."
        >
          使用AI生成数据
        </Button>
        
        {errorMessage && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <Box mt={6} p={4} bg="gray.50" borderRadius="md">
          <Text fontWeight="bold" mb={2}>使用说明:</Text>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            <li style={{ fontSize: 'sm', marginBottom: '4px' }}>在文本框中描述您想要生成的数据特征</li>
            <li style={{ fontSize: 'sm', marginBottom: '4px' }}>调整样本大小</li>
            <li style={{ fontSize: 'sm', marginBottom: '4px' }}>点击"使用AI生成数据"按钮</li>
            <li style={{ fontSize: 'sm', marginBottom: '4px' }}>等待AI生成符合您描述的数据</li>
          </ul>
          
          <Text mt={4} fontWeight="bold" mb={2}>示例描述:</Text>
          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
            <li style={{ fontSize: 'sm', marginBottom: '4px' }}>• 生成符合正态分布的随机数据</li>
            <li style={{ fontSize: 'sm', marginBottom: '4px' }}>• 生成在0到1之间均匀分布的数据</li>
            <li style={{ fontSize: 'sm', marginBottom: '4px' }}>• 生成指数分布的等待时间数据</li>
          </ul>
        </Box>
      </VStack>
    </Box>
  );
}

export default AIDataGenerator;