
import React, { useMemo } from 'react';
import { ParsedData, ConfidenceIntervalStat as CIStatType, ConfidenceIntervalData } from '../types';
import { processColumn, calculateConfidenceIntervalsForMean, formatNumber } from '../utils/statisticsCalculator';
import DataTable from './DataTable';

interface ConfidenceIntervalTableProps {
  data: ParsedData;
  fileName: string | null;
}

const ConfidenceIntervalTable: React.FC<ConfidenceIntervalTableProps> = ({ data, fileName }) => {
  const confidenceIntervalStats = useMemo<CIStatType[]>(() => {
    if (!data || data.length === 0) return [];

    const headers = Object.keys(data[0]);
    const statsArray: CIStatType[] = [];

    headers.forEach(header => {
      const columnValues = data.map(row => row[header]);
      const { numericValues } = processColumn(columnValues);
      
      if (numericValues.length > 0) { // Only calculate for columns with numeric data
        statsArray.push(calculateConfidenceIntervalsForMean(header, numericValues));
      }
    });
    return statsArray;
  }, [data]);

  if (!data || data.length === 0 || confidenceIntervalStats.length === 0) {
    return null; // Don't render if no data or no numeric columns to analyze
  }
  
  const tableHeaderKeys = [
    'Variable', 
    'Mean', 
    'SEM', 
    '90% CI',
    '95% CI',
    '99% CI'
  ];

  const tableHeaderDisplay = [
    <>Variable<br/><span className="font-sans font-normal text-xs opacity-90">變量</span></>, 
    <>Mean<br/><span className="font-sans font-normal text-xs opacity-90">平均值</span></>, 
    <>SEM<br/><span className="font-sans font-normal text-xs opacity-90">標準誤</span></>, 
    <>90% CI<br/><span className="font-sans font-normal text-xs opacity-90">信賴區間</span></>,
    <>95% CI<br/><span className="font-sans font-normal text-xs opacity-90">信賴區間</span></>,
    <>99% CI<br/><span className="font-sans font-normal text-xs opacity-90">信賴區間</span></>
  ];
  
  const formatCI = (ci: ConfidenceIntervalData | string): string => {
    if (typeof ci === 'string') return ci; // For 'N/A'
    return `[${ci.lower}, ${ci.upper}]`;
  };

  const tableRows = confidenceIntervalStats.map(stat => ({
    [tableHeaderKeys[0]]: stat.variable,
    [tableHeaderKeys[1]]: stat.mean,
    [tableHeaderKeys[2]]: stat.sem,
    [tableHeaderKeys[3]]: formatCI(stat.ci90),
    [tableHeaderKeys[4]]: formatCI(stat.ci95),
    [tableHeaderKeys[5]]: formatCI(stat.ci99),
  }));

  const numericColumnsFound = confidenceIntervalStats.some(stat => stat.count > 0 && stat.sem !== 'N/A');


  return (
    <div className="mt-8 p-6 bg-[var(--kraft-card-bg-light)] dark:bg-[var(--kraft-card-bg-dark)] shadow-lg rounded-lg border border-[var(--kraft-border-light)] dark:border-[var(--kraft-border-dark)] bg-opacity-75 dark:bg-opacity-75 backdrop-blur-sm"
         style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.02) 100%)' }}>
      <h2 className="text-2xl font-semibold mb-4 text-[var(--kraft-text-light)] dark:text-[var(--kraft-text-dark)] font-special leading-tight">
        Mean Confidence Intervals {fileName && <>for {fileName}</>}
        <br />
        <span className="text-xl">平均數信賴區間 {fileName && <>檔案 {fileName}</>}</span>
      </h2>
      {numericColumnsFound ? (
        <DataTable headers={tableHeaderDisplay.map(h => h.props.children.join ? h.props.children.join('') : String(h))} rows={tableRows} />
      ) : (
        <p className="text-[var(--kraft-muted-text-light)] dark:text-[var(--kraft-muted-text-dark)]">No numeric data suitable for confidence interval calculation found in the uploaded file.</p>
      )}
    </div>
  );
};

export default ConfidenceIntervalTable;