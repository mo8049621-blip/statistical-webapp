import { useState, useRef } from 'react';
import { Box, Button, Text, Alert, AlertIcon, AlertDescription, Progress } from '@chakra-ui/react';
import { FileUploaderProps } from '../types';

function FileUploader({ onDataChange }: FileUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setErrorMessage('');
    setUploadProgress(0);

    // 模拟上传进度
    const progressInterval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 20;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          processFile(file);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    // 重置文件输入，以便可以重复上传同一个文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = parseCSV(content);
        
        if (data.length === 0) {
          throw new Error('文件中未找到有效的数值数据');
        }

        onDataChange(data, {
          type: 'csv',
          name: 'CSV导入数据',
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : '处理文件时发生错误'
        );
      }
    };

    reader.onerror = () => {
      setErrorMessage('读取文件时发生错误');
    };

    reader.readAsText(file);
  };

  const parseCSV = (content: string): number[] => {
    const lines = content.split(/\r\n|\n/).filter((line) => line.trim());
    const data: number[] = [];

    // 检查是否有表头
    const firstLineNumbers = lines[0].split(',').map((item) => parseFloat(item.trim()));
    const hasHeader = firstLineNumbers.some((num) => isNaN(num));

    // 从适当的行开始解析数据
    const startLine = hasHeader ? 1 : 0;

    for (let i = startLine; i < lines.length; i++) {
      const values = lines[i].split(',');
      
      for (const value of values) {
        const trimmedValue = value.trim();
        if (trimmedValue) {
          const num = parseFloat(trimmedValue);
          if (!isNaN(num)) {
            data.push(num);
          }
        }
      }
    }

    return data;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box p={4}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        style={{ display: 'none' }}
      />
      
      <Button
        onClick={handleUploadClick}
        colorScheme="blue"
        variant="solid"
        size="lg"
      >
        上传CSV文件
      </Button>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box mt={4}>
          <Progress value={uploadProgress} width="100%" />
          <Text fontSize="sm" mt={1} color="gray.500">
            处理中... {uploadProgress}%
          </Text>
        </Box>
      )}

      {selectedFileName && uploadProgress === 100 && (
        <Text mt={4} color="green.600">
          已成功上传: {selectedFileName}
        </Text>
      )}

      {errorMessage && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Box mt={6} p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="sm" color="gray.600">
          <strong>使用说明:</strong>
          <br />• 仅支持CSV格式文件
          <br />• 文件可以包含或不包含表头
          <br />• 数据可以是单列或多列
          <br />• 仅提取数值数据进行分析
        </Text>
      </Box>
    </Box>
  );
}

export default FileUploader;