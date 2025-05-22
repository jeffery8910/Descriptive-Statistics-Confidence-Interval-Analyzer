import React, { useMemo } from 'react';
import { ParsedData, DescriptiveStats as DescriptiveStatsType } from '../types';
import { processColumn, generateDescriptiveStats } from '../utils/statisticsCalculator';
import DataTable from './DataTable';

interface StatisticsTableProps {
  data: ParsedData;
  fileName: string | null;
}

const StatisticsTable: React.FC<StatisticsTableProps> = ({ data, fileName }) => {
  const statistics = useMemo<DescriptiveStatsType[]>(() => {
    if (!data || data.length === 0) return [];

    const headers = Object.keys(data[0]);
    const statsArray: DescriptiveStatsType[] = [];

    headers.forEach(header => {
      const columnValues = data.map(row => row[header]);
      const { numericValues, nonNumericCount } = processColumn(columnValues);
      
      if (numericValues.length > 0) {
        statsArray.push(generateDescriptiveStats(header, numericValues));
      } else if (columnValues.length > 0) { 
        statsArray.push({
          variable: header,
          count: 0, 
          mean: 'N/A (Non-numeric or empty)',
          median: 'N/A',
          mode: 'N/A',
          stdDev: 'N/A',
          variance: 'N/A',
          min: 'N/A',
          max: 'N/A',
          range: 'N/A',
        });
      }
    });
    return statsArray;
  }, [data]);

  if (!data || data.length === 0) {
    return null;
  }
  
  const tableHeaders = [
    <>Variable<br/><span className="font-normal text-xs normal-case">變量</span></>, 
    <>Count<br/><span className="font-normal text-xs normal-case">計數</span></>, 
    <>Mean<br/><span className="font-normal text-xs normal-case">平均值</span></>, 
    <>Median<br/><span className="font-normal text-xs normal-case">中位數</span></>, 
    <>Mode<br/><span className="font-normal text-xs normal-case">眾數</span></>, 
    <>Std. Dev.<br/><span className="font-normal text-xs normal-case">標準差</span></>, 
    <>Variance<br/><span className="font-normal text-xs normal-case">方差</span></>, 
    <>Min<br/><span className="font-normal text-xs normal-case">最小值</span></>, 
    <>Max<br/><span className="font-normal text-xs normal-case">最大值</span></>, 
    <>Range<br/><span className="font-normal text-xs normal-case">全距</span></>
  ].map(h => h.props.children.join('')); // For key generation in DataTable
  
  const tableHeaderDisplay = [
    <>Variable<br/><span className="font-sans font-normal text-xs opacity-90">變量</span></>, 
    <>Count<br/><span className="font-sans font-normal text-xs opacity-90">計數</span></>, 
    <>Mean<br/><span className="font-sans font-normal text-xs opacity-90">平均值</span></>, 
    <>Median<br/><span className="font-sans font-normal text-xs opacity-90">中位數</span></>, 
    <>Mode<br/><span className="font-sans font-normal text-xs opacity-90">眾數</span></>, 
    <>Std. Dev.<br/><span className="font-sans font-normal text-xs opacity-90">標準差</span></>, 
    <>Variance<br/><span className="font-sans font-normal text-xs opacity-90">方差</span></>, 
    <>Min<br/><span className="font-sans font-normal text-xs opacity-90">最小值</span></>, 
    <>Max<br/><span className="font-sans font-normal text-xs opacity-90">最大值</span></>, 
    <>Range<br/><span className="font-sans font-normal text-xs opacity-90">全距</span></>
  ];


  const tableRows = statistics.map(stat => ({
    [tableHeaders[0]]: stat.variable,
    [tableHeaders[1]]: stat.count,
    [tableHeaders[2]]: stat.mean,
    [tableHeaders[3]]: stat.median,
    [tableHeaders[4]]: stat.mode,
    [tableHeaders[5]]: stat.stdDev,
    [tableHeaders[6]]: stat.variance,
    [tableHeaders[7]]: stat.min,
    [tableHeaders[8]]: stat.max,
    [tableHeaders[9]]: stat.range,
  }));

  const numericColumnsFound = statistics.some(stat => stat.count > 0);

  return (
    <div className="mt-8 p-6 bg-[var(--kraft-card-bg-light)] dark:bg-[var(--kraft-card-bg-dark)] shadow-lg rounded-lg border border-[var(--kraft-border-light)] dark:border-[var(--kraft-border-dark)] bg-opacity-75 dark:bg-opacity-75 backdrop-blur-sm"
         style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.02) 100%)' }}>
      <h2 className="text-2xl font-semibold mb-4 text-[var(--kraft-text-light)] dark:text-[var(--kraft-text-dark)] font-special leading-tight">
        Descriptive Statistics {fileName && <>for {fileName}</>}
        <br />
        <span className="text-xl">描述性統計 {fileName && <>檔案 {fileName}</>}</span>
      </h2>
      {numericColumnsFound ? (
        <DataTable headers={tableHeaderDisplay.map(h => h.props.children.join ? h.props.children.join('') : String(h))} rows={tableRows} />
      ) : (
        <p className="text-[var(--kraft-muted-text-light)] dark:text-[var(--kraft-muted-text-dark)]">No numeric data found in the uploaded file to calculate statistics.</p>
      )}
    </div>
  );
};

export default StatisticsTable;