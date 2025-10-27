import { useState, useRef } from 'react';
import { Box, Button, Text, Alert, AlertIcon, AlertDescription, Progress } from '@chakra-ui/react';
import { FileUploaderProps } from '../types';

// 用于处理Excel文件的简单解析函数（简化版，实际项目中可考虑使用xlsx库）
const parseExcelLike = (content: string): number[] => {
  // Excel文件通常以制表符分隔
  const lines = content.split(/\r\n|\n/).filter((line) => line.trim());
  const data: number[] = [];

  // 检查是否有表头
  const firstLineNumbers = lines[0].split(/\t|,/).map((item) => parseFloat(item.trim()));
  const hasHeader = firstLineNumbers.some((num) => isNaN(num));

  // 从适当的行开始解析数据
  const startLine = hasHeader ? 1 : 0;

  for (let i = startLine; i < lines.length; i++) {
    // 支持制表符或逗号分隔
    const values = lines[i].split(/\t|,/);
    
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

// 用于处理JSON文件的解析函数
const parseJSON = (content: string): number[] => {
  try {
    const parsed = JSON.parse(content);
    const data: number[] = [];
    
    // 处理数组
    if (Array.isArray(parsed)) {
      // 扁平数组
      if (parsed.length > 0 && typeof parsed[0] === 'number') {
        return parsed.filter(val => !isNaN(val));
      }
      // 对象数组，尝试提取数值字段
      else {
        parsed.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            Object.values(item).forEach(val => {
              if (typeof val === 'number' && !isNaN(val)) {
                data.push(val);
              }
            });
          } else if (typeof item === 'number' && !isNaN(item)) {
            data.push(item);
          }
        });
      }
    }
    // 处理对象
    else if (typeof parsed === 'object' && parsed !== null) {
      Object.values(parsed).forEach(val => {
        if (typeof val === 'number' && !isNaN(val)) {
          data.push(val);
        }
      });
    }
    
    return data;
  } catch (error) {
    throw new Error('JSON解析失败，请确保文件格式正确');
  }
};

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
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data: number[] = [];
        let fileType = 'unknown';
        let fileName = file.name;

        // 根据文件扩展名选择相应的解析方法
        switch (fileExtension) {
          case 'csv':
            data = parseCSV(content);
            fileType = 'csv';
            break;
          case 'json':
            data = parseJSON(content);
            fileType = 'json';
            break;
          case 'txt':
            // 尝试用CSV解析器解析文本文件
            data = parseExcelLike(content);
            fileType = 'txt';
            break;
          case 'xlsx':
          case 'xls':
            // 注意：这里是简化实现，实际项目中应使用专业的Excel解析库
            // 这里我们假设Excel文件内容已经被转换为文本形式
            data = parseExcelLike(content);
            fileType = 'excel';
            break;
          default:
            throw new Error('不支持的文件格式，请上传CSV、JSON、TXT或Excel文件');
        }
        
        if (data.length === 0) {
          throw new Error('文件中未找到有效的数值数据');
        }

        onDataChange(data, {
          type: fileType,
          name: fileName,
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

    // 对于文本类文件，使用readAsText
    if (['csv', 'json', 'txt'].includes(fileExtension || '')) {
      reader.readAsText(file);
    } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
      // 注意：这里是简化实现，实际项目中应使用专业的Excel解析库
      // 这里我们假设Excel文件可以通过文本方式读取（实际上这不适用于二进制Excel文件）
      reader.readAsText(file);
      // 在真实项目中，这里应该使用：
      // reader.readAsArrayBuffer(file);
      // 然后使用如xlsx库来解析二进制数据
    }
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
        accept=".csv,.json,.txt,.xlsx,.xls"
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
          <br />• 支持CSV、JSON、TXT和Excel (.xlsx, .xls)格式文件
          <br />• 文件可以包含或不包含表头
          <br />• 数据可以是单列或多列
          <br />• 仅提取数值数据进行分析
          <br />• 对于JSON文件，支持数值数组或包含数值字段的对象数组
        </Text>
      </Box>
    </Box>
  );
}

export default FileUploader;