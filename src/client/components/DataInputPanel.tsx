import { Box, Text, Button, Grid, GridItem } from '@chakra-ui/react';
import FileUploader from './FileUploader';
import DistributionGenerator from './DistributionGenerator';
import AIDataGenerator from './AIDataGenerator';
import { useState } from 'react';
import { DataInputPanelProps } from '../types';

function DataInputPanel({ onDataChange }: DataInputPanelProps) {
  const [activePanel, setActivePanel] = useState<string>('distribution');

  return (
    <Box p={6} border="1px" borderColor="gray.200" borderRadius="md" bg="white">
      <Grid templateColumns="repeat(3, 1fr)" gap={2} mb={4}>
        <Button
          onClick={() => setActivePanel('upload')}
          variant={activePanel === 'upload' ? 'solid' : 'outline'}
          colorScheme="blue"
        >
          文件上传
        </Button>
        <Button
          onClick={() => setActivePanel('distribution')}
          variant={activePanel === 'distribution' ? 'solid' : 'outline'}
          colorScheme="blue"
        >
          分布生成
        </Button>
        <Button
          onClick={() => setActivePanel('ai')}
          variant={activePanel === 'ai' ? 'solid' : 'outline'}
          colorScheme="blue"
        >
          AI生成数据
        </Button>
      </Grid>
      
      {activePanel === 'upload' && (
        <FileUploader onDataChange={onDataChange} />
      )}
      {activePanel === 'distribution' && (
        <DistributionGenerator onDataChange={onDataChange} />
      )}
      {activePanel === 'ai' && (
        <AIDataGenerator onDataChange={onDataChange} />
      )}
    </Box>
  );
}

export default DataInputPanel;