import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import StatisticsApp from './pages/StatisticsApp';

// 创建一个完整的主题配置，确保包含所有必要的组件样式
const theme = extendTheme({
  colors: {
    primary: '#3182ce',
    secondary: '#2d3748',
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  components: {
    // 确保Tabs组件有正确的样式配置
    Tabs: {
      baseStyle: {
        tab: {
          _selected: {
            color: 'primary',
          },
        },
      },
    },
  },
});

function App() {
  // 简化App组件，确保ChakraProvider正确包裹所有组件
  return (
    <ChakraProvider theme={theme}>
      <StatisticsApp />
    </ChakraProvider>
  );
}

export default App;