import React, { useMemo } from 'react';
import { ParsedData } from '../types';
import DataTable from './DataTable';

interface RawDataTableProps {
  data: ParsedData;
  fileName: string | null;
}

const RawDataTable: React.FC<RawDataTableProps> = ({ data, fileName }) => {
  const headers = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const tableRows = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(row => ({ ...row })); 
  }, [data]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-[var(--kraft-card-bg-light)] dark:bg-[var(--kraft-card-bg-dark)] shadow-lg rounded-lg border border-[var(--kraft-border-light)] dark:border-[var(--kraft-border-dark)] bg-opacity-75 dark:bg-opacity-75 backdrop-blur-sm"
         style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.02) 100%)' }}>
      <h2 className="text-2xl font-semibold mb-4 text-[var(--kraft-text-light)] dark:text-[var(--kraft-text-dark)] font-special leading-tight">
        Raw Data {fileName && <>from {fileName}</>}
        <br />
        <span className="text-xl">原始數據 {fileName && <>來自 {fileName}</>}</span>
      </h2>
      {headers.length > 0 ? (
        <DataTable headers={headers} rows={tableRows} />
      ) : (
        <p className="text-[var(--kraft-muted-text-light)] dark:text-[var(--kraft-muted-text-dark)]">No data to display or headers could not be determined.</p>
      )}
    </div>
  );
};

export default RawDataTable;