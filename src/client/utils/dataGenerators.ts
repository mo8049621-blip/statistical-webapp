// 数据生成工具函数

// 生成正态分布数据
export function generateNormalData(n: number, mean: number, stdDev: number): number[] {
  const data: number[] = [];
  for (let i = 0; i < n; i++) {
    // 使用Box-Muller变换生成正态分布随机数
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    data.push(mean + stdDev * z);
  }
  return data;
}

// 生成均匀分布数据
export function generateUniformData(n: number, min: number, max: number): number[] {
  const data: number[] = [];
  for (let i = 0; i < n; i++) {
    data.push(min + Math.random() * (max - min));
  }
  return data;
}

// 生成二项分布数据
export function generateBinomialData(n: number, p: number): number[] {
  const data: number[] = [];
  for (let i = 0; i < n; i++) {
    data.push(Math.random() < p ? 1 : 0);
  }
  return data;
}

// 生成配对正态数据
export function generatePairedNormalData(
  n: number,
  meanBefore: number,
  meanDifference: number,
  stdDev: number,
  correlation: number
): { before: number[]; after: number[] } {
  const before: number[] = [];
  const after: number[] = [];
  
  for (let i = 0; i < n; i++) {
    // 使用Box-Muller变换生成正态分布随机数
    let u1 = 0, v1 = 0;
    while(u1 === 0) u1 = Math.random();
    while(v1 === 0) v1 = Math.random();
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * v1);
    
    let u2 = 0, v2 = 0;
    while(u2 === 0) u2 = Math.random();
    while(v2 === 0) v2 = Math.random();
    const z2 = Math.sqrt(-2.0 * Math.log(u2)) * Math.cos(2.0 * Math.PI * v2);
    
    // 生成相关的配对数据
    const x = meanBefore + stdDev * z1;
    const y = (meanBefore + meanDifference) + 
               correlation * stdDev * z1 + 
               Math.sqrt(1 - correlation * correlation) * stdDev * z2;
    
    before.push(x);
    after.push(y);
  }
  
  return { before, after };
}