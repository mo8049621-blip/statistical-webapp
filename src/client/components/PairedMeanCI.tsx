import { useState, useEffect } from 'react';
import { Box, Text, Button, VStack, HStack, Card, CardBody, Table, Tr, Th, Td, Alert, Select, Textarea } from '@chakra-ui/react';
import { calculateTwoSampleConfidenceInterval } from '../utils/statistics';

interface PairedMeanCIProps {
  pairedData?: { before: number[]; after: number[] };
}

function PairedMeanCI({ pairedData = { before: [], after: [] } }: PairedMeanCIProps) {
  const [beforeData, setBeforeData] = useState<string>('');
  const [afterData, setAfterData] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<string>('0.95');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (pairedData && pairedData.before && pairedData.after && pairedData.before.length > 0 && pairedData.after.length > 0) {
      setBeforeData(pairedData.before.join(', '));
      setAfterData(pairedData.after.join(', '));
    }
  }, [pairedData]);

  const parseData = (dataStr: string): number[] => {
    return dataStr
      .split(/[,\s]+/)
      .filter(s => s.trim() !== '')
      .map(s => {
        const num = parseFloat(s);
        if (isNaN(num)) throw new Error('Invalid data format, please enter numbers');
        return num;
      });
  };

  const handleCalculate = () => {
    try {
      setError('');
      const before = parseData(beforeData);
      const after = parseData(afterData);
      const confidence = parseFloat(confidenceLevel);

      if (before.length === 0 || after.length === 0) {
        throw new Error('Data cannot be empty');
      }

      if (before.length !== after.length) {
        throw new Error('Before and after datasets must have the same length');
      }

      const ciResult = calculateTwoSampleConfidenceInterval(
        before,
        after,
        confidence,
        { method: 'paired' }
      );

      setResult(ciResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResult(null);
    }
  };

  const differences = result ? beforeData.split(/[,\s]+/).map((_, i) => {
    const before = parseFloat(beforeData.split(/[,\s]+/)[i]);
    const after = parseFloat(afterData.split(/[,\s]+/)[i]);
    return before - after;
  }).filter(n => !isNaN(n)) : [];

  return (
    <Card>
      <CardBody>
        <Text fontSize="xl" fontWeight="bold" mb={6} textAlign="center">
          Paired Samples Mean Difference Confidence Interval
        </Text>

        {error && (
          <Alert status="error" mb={4}>
            {error}
          </Alert>
        )}

        <VStack spacing={4} align="stretch">
          <Box>
            <Text fontWeight="medium" mb={2}>Pre-test Data (comma or space separated)</Text>
            <Textarea
              value={beforeData}
              onChange={(e) => setBeforeData(e.target.value)}
              placeholder="Example: 10.2, 11.5, 9.8, 12.1"
              size="lg"
              rows={3}
            />
          </Box>

          <Box>
            <Text fontWeight="medium" mb={2}>Post-test Data (comma or space separated)</Text>
            <Textarea
              value={afterData}
              onChange={(e) => setAfterData(e.target.value)}
              placeholder="Example: 12.5, 13.2, 11.8, 14.2"
              size="lg"
              rows={3}
            />
          </Box>

          <HStack>
            <Box flex={1}>
              <Text fontWeight="medium" mb={2}>Confidence Level</Text>
              <Select
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(e.target.value)}
                size="lg"
              >
                <option value="0.90">90%</option>
                <option value="0.95">95%</option>
                <option value="0.99">99%</option>
                <option value="0.999">99.9%</option>
              </Select>
            </Box>
            <Button onClick={handleCalculate} colorScheme="blue" size="lg">
              Calculate Confidence Interval
            </Button>
          </HStack>
        </VStack>

        {result && (
          <Box mt={6} p={4} borderWidth={1} borderRadius="lg" bg="gray.50">
            <Text fontSize="lg" fontWeight="bold" mb={4}>Calculation Results</Text>
            
            <Table variant="simple" mb={4}>
              <tbody>
                <Tr>
                  <Th>Statistic</Th>
                  <Td>{result.method}</Td>
                </Tr>
                <Tr>
                  <Th>Mean Difference</Th>
                  <Td>{result.meanDiff.toFixed(4)}</Td>
                </Tr>
                <Tr>
                  <Th>Critical Value</Th>
                  <Td>{result.criticalValue.toFixed(4)}</Td>
                </Tr>
                <Tr>
                  <Th>Margin of Error</Th>
                  <Td>{result.marginOfError.toFixed(4)}</Td>
                </Tr>
                <Tr>
                  <Th>Confidence Interval</Th>
                  <Td>[{result.lower.toFixed(4)}, {result.upper.toFixed(4)}]</Td>
                </Tr>
              </tbody>
            </Table>

            {differences.length > 0 && (
              <Box mt={4}>
                <Text fontWeight="medium" mb={2}>Difference Data Statistics</Text>
                <Table variant="simple">
                  <thead>
                    <Tr>
                      <Th>Index</Th>
                      <Th>Pre-test Value</Th>
                      <Th>Post-test Value</Th>
                      <Th>Difference</Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {differences.slice(0, 10).map((diff, i) => (
                      <Tr key={i}>
                        <Td>{i + 1}</Td>
                        <Td>{parseFloat(beforeData.split(/[,\s]+/)[i]).toFixed(2)}</Td>
                        <Td>{parseFloat(afterData.split(/[,\s]+/)[i]).toFixed(2)}</Td>
                        <Td>{diff.toFixed(2)}</Td>
                      </Tr>
                    ))}
                    {differences.length > 10 && (
                      <Tr>
                        <Td colSpan={4} textAlign="center">...</Td>
                      </Tr>
                    )}
                  </tbody>
                </Table>
              </Box>
            )}
          </Box>
        )}
      </CardBody>
    </Card>
  );
}

export default PairedMeanCI;