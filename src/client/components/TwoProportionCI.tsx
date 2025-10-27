import { useState } from 'react';
import { Box, Text, Input, Button, VStack, HStack, Card, CardBody, Table, Tr, Th, Td, Alert, Select, RadioGroup, Radio, Stack } from '@chakra-ui/react';
import { calculateTwoProportionConfidenceInterval } from '../utils/statistics';

function TwoProportionCI() {
  const [successes1, setSuccesses1] = useState<string>('');
  const [trials1, setTrials1] = useState<string>('');
  const [successes2, setSuccesses2] = useState<string>('');
  const [trials2, setTrials2] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95);
  const [method, setMethod] = useState<'wald' | 'continuity'>('wald');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    try {
      setError('');
      
      const s1 = parseInt(successes1, 10);
      const t1 = parseInt(trials1, 10);
      const s2 = parseInt(successes2, 10);
      const t2 = parseInt(trials2, 10);
      const confidence = confidenceLevel;

      // 参数验证
      if (isNaN(s1) || isNaN(t1) || isNaN(s2) || isNaN(t2)) {
        throw new Error('请输入有效的整数');
      }

      if (t1 <= 0 || t2 <= 0) {
        throw new Error('试验次数必须大于0');
      }

      if (s1 < 0 || s1 > t1 || s2 < 0 || s2 > t2) {
        throw new Error('成功次数必须在0到试验次数之间');
      }

      const ciResult = calculateTwoProportionConfidenceInterval(
        s1,
        t1,
        s2,
        t2,
        confidence,
        { method }
      );

      setResult(ciResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '计算错误');
      setResult(null);
    }
  };

  return (
    <Card>
      <CardBody>
        <Text fontSize="xl" fontWeight="bold" mb={6} textAlign="center">
          两比例之差的置信区间
        </Text>

        {error && (
          <Alert status="error" mb={4}>
            {error}
          </Alert>
        )}

        <VStack spacing={4} align="stretch">
          <Box p={4} borderWidth={1} borderRadius="lg">
            <Text fontWeight="medium" mb={4}>第一组样本</Text>
            <HStack spacing={4}>
              <Box flex={1}>
                <Text fontSize="sm" mb={1}>成功次数</Text>
                <Input
                  value={successes1}
                  onChange={(e) => setSuccesses1(e.target.value)}
                  placeholder="例如：45"
                  type="number"
                  min="0"
                  size="lg"
                />
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" mb={1}>总试验次数</Text>
                <Input
                  value={trials1}
                  onChange={(e) => setTrials1(e.target.value)}
                  placeholder="例如：100"
                  type="number"
                  min="1"
                  size="lg"
                />
              </Box>
            </HStack>
          </Box>

          <Box p={4} borderWidth={1} borderRadius="lg">
            <Text fontWeight="medium" mb={4}>第二组样本</Text>
            <HStack spacing={4}>
              <Box flex={1}>
                <Text fontSize="sm" mb={1}>成功次数</Text>
                <Input
                  value={successes2}
                  onChange={(e) => setSuccesses2(e.target.value)}
                  placeholder="例如：60"
                  type="number"
                  min="0"
                  size="lg"
                />
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" mb={1}>总试验次数</Text>
                <Input
                  value={trials2}
                  onChange={(e) => setTrials2(e.target.value)}
                  placeholder="例如：100"
                  type="number"
                  min="1"
                  size="lg"
                />
              </Box>
            </HStack>
          </Box>

          <HStack spacing={4}>
            <Box flex={1}>
              <Text fontWeight="medium" mb={2}>置信水平</Text>
              <Select
                value={confidenceLevel.toString()}
                onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
                size="lg"
              >
                <option value="0.90">90%</option>
                <option value="0.95">95%</option>
                <option value="0.99">99%</option>
                <option value="0.999">99.9%</option>
              </Select>
            </Box>
            <Box flex={1}>
              <Text fontWeight="medium" mb={2}>计算方法</Text>
              <RadioGroup value={method} onChange={(v) => setMethod(v as 'wald' | 'continuity')}>
                <Stack direction="row">
                  <Radio value="wald">Wald区间</Radio>
                  <Radio value="continuity">连续性修正</Radio>
                </Stack>
              </RadioGroup>
            </Box>
          </HStack>

          <Button onClick={handleCalculate} colorScheme="blue" size="lg">
            计算置信区间
          </Button>
        </VStack>

        {result && (
          <Box mt={6} p={4} borderWidth={1} borderRadius="lg" bg="gray.50">
            <Text fontSize="lg" fontWeight="bold" mb={4}>计算结果</Text>
            
            <Table variant="simple">
              <tbody>
                <Tr>
                  <Th>统计量</Th>
                  <Th>值</Th>
                </Tr>
                <Tr>
                  <Th>计算方法</Th>
                  <Td>{result.method}</Td>
                </Tr>
                <Tr>
                  <Th>第一组比例</Th>
                  <Td>{(result.proportion1 * 100).toFixed(2)}%</Td>
                </Tr>
                <Tr>
                  <Th>第二组比例</Th>
                  <Td>{(result.proportion2 * 100).toFixed(2)}%</Td>
                </Tr>
                <Tr>
                  <Th>比例差</Th>
                  <Td>{(result.proportionDiff * 100).toFixed(2)}%</Td>
                </Tr>
                <Tr>
                  <Th>临界值</Th>
                  <Td>{result.criticalValue.toFixed(4)}</Td>
                </Tr>
                <Tr>
                  <Th>边际误差</Th>
                  <Td>{(result.marginOfError * 100).toFixed(2)}%</Td>
                </Tr>
                <Tr>
                  <Th>置信区间</Th>
                  <Td>[{(result.lower * 100).toFixed(2)}%, {(result.upper * 100).toFixed(2)}%]</Td>
                </Tr>
              </tbody>
            </Table>

            <Box mt={4} p={3} bg="blue.50" borderRadius="lg">
              <Text fontWeight="medium">结果解释</Text>
              <Text mt={1} fontSize="sm">
                我们有{confidenceLevel * 100}%的信心认为，两个总体比例之差位于[{(result.lower * 100).toFixed(2)}%, {(result.upper * 100).toFixed(2)}%]之间。
                {result.lower > 0 && " 这表明第一个总体的比例显著高于第二个总体。"}
                {result.upper < 0 && " 这表明第一个总体的比例显著低于第二个总体。"}
                {result.lower <= 0 && result.upper >= 0 && " 两个总体的比例可能没有显著差异。"}
              </Text>
            </Box>
          </Box>
        )}
      </CardBody>
    </Card>
  );
}

export default TwoProportionCI;