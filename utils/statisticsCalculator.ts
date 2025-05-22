
import type { DescriptiveStats, ConfidenceIntervalStat, ConfidenceIntervalData } from '../types';

// Helper to format numbers or return 'N/A'
export const formatNumber = (num: number | undefined | null, precision: number = 2): string => {
  if (num === undefined || num === null || isNaN(num) || !isFinite(num)) {
    return 'N/A';
  }
  return num.toFixed(precision);
};

export const calculateMean = (data: number[]): number | undefined => {
  if (data.length === 0) return undefined;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
};

export const calculateMedian = (data: number[]): number | undefined => {
  if (data.length === 0) return undefined;
  const sortedData = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sortedData.length / 2);
  return sortedData.length % 2 !== 0
    ? sortedData[mid]
    : (sortedData[mid - 1] + sortedData[mid]) / 2;
};

export const calculateMode = (data: number[]): number[] | undefined => {
  if (data.length === 0) return undefined;
  const frequencyMap: { [key: number]: number } = {};
  let maxFrequency = 0;
  
  data.forEach(num => {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    if (frequencyMap[num] > maxFrequency) {
      maxFrequency = frequencyMap[num];
    }
  });

  if (maxFrequency === 1 && data.length > 1 && new Set(data).size === data.length) { // All values unique
    return undefined; // Or handle as "No mode"
  }

  const modes: number[] = [];
  for (const num in frequencyMap) {
    if (frequencyMap[num] === maxFrequency) {
      modes.push(parseFloat(num));
    }
  }
  return modes;
};

export const calculateVariance = (data: number[], mean?: number): number | undefined => {
  if (data.length < 2) return undefined; // Variance needs at least 2 data points for sample variance
  const m = mean !== undefined ? mean : calculateMean(data);
  if (m === undefined) return undefined;
  const squaredDifferences = data.map(val => (val - m) ** 2);
  return squaredDifferences.reduce((acc, val) => acc + val, 0) / (data.length - 1); // Sample variance
};

export const calculateStdDev = (data: number[], mean?: number): number | undefined => {
  const variance = calculateVariance(data, mean);
  return variance !== undefined ? Math.sqrt(variance) : undefined;
};

export const calculateMin = (data: number[]): number | undefined => {
  if (data.length === 0) return undefined;
  return Math.min(...data);
};

export const calculateMax = (data: number[]): number | undefined => {
  if (data.length === 0) return undefined;
  return Math.max(...data);
};

export const calculateRange = (data: number[]): number | undefined => {
  if (data.length === 0) return undefined;
  const min = calculateMin(data);
  const max = calculateMax(data);
  if (min === undefined || max === undefined) return undefined;
  return max - min;
};

export const processColumn = (columnData: (string | number)[]): { numericValues: number[], nonNumericCount: number } => {
  const numericValues: number[] = [];
  let nonNumericCount = 0;
  columnData.forEach(val => {
    if (val === null || val === undefined || val === '') {
        nonNumericCount++;
        return;
    }
    const num = parseFloat(String(val));
    if (!isNaN(num) && isFinite(num)) {
      numericValues.push(num);
    } else {
      nonNumericCount++;
    }
  });
  return { numericValues, nonNumericCount };
};

export const generateDescriptiveStats = (
  variable: string,
  data: number[]
): DescriptiveStats => {
  const mean = calculateMean(data);
  const modeVal = calculateMode(data);

  return {
    variable,
    count: data.length,
    mean: formatNumber(mean),
    median: formatNumber(calculateMedian(data)),
    mode: modeVal ? modeVal.map(m => formatNumber(m, 2)).join(', ') : 'N/A',
    stdDev: formatNumber(calculateStdDev(data, mean)),
    variance: formatNumber(calculateVariance(data, mean)),
    min: formatNumber(calculateMin(data)),
    max: formatNumber(calculateMax(data)),
    range: formatNumber(calculateRange(data)),
  };
};

export const calculateConfidenceIntervalsForMean = (
  variableName: string,
  data: number[]
): ConfidenceIntervalStat => {
  const count = data.length;
  const mean = calculateMean(data);
  
  if (count < 2 || mean === undefined) {
    return {
      variable: variableName,
      mean: formatNumber(mean),
      sem: 'N/A',
      ci90: 'N/A',
      ci95: 'N/A',
      ci99: 'N/A',
      count: count,
    };
  }

  const stdDev = calculateStdDev(data, mean);

  if (stdDev === undefined || stdDev === 0) {
    // If stdDev is 0, all values are the same as the mean. Interval is just the mean.
    const meanStr = formatNumber(mean);
    const ci: ConfidenceIntervalData = { lower: meanStr, upper: meanStr };
    return {
      variable: variableName,
      mean: meanStr,
      sem: formatNumber(0), // SEM is 0
      ci90: ci,
      ci95: ci,
      ci99: ci,
      count: count,
    };
  }

  const sem = stdDev / Math.sqrt(count);

  const zScores = {
    z90: 1.645,
    z95: 1.96,
    z99: 2.58,
  };

  const calculateCI = (z: number): ConfidenceIntervalData => {
    const marginOfError = z * sem;
    return {
      lower: formatNumber(mean - marginOfError),
      upper: formatNumber(mean + marginOfError),
    };
  };

  return {
    variable: variableName,
    mean: formatNumber(mean),
    sem: formatNumber(sem, 3), // SEM often shown with more precision
    ci90: calculateCI(zScores.z90),
    ci95: calculateCI(zScores.z95),
    ci99: calculateCI(zScores.z99),
    count: count,
  };
};
