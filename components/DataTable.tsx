import React from 'react';

interface DataTableProps {
  headers: string[];
  rows: Array<Record<string, React.ReactNode>>;
  caption?: string;
}

const DataTable: React.FC<DataTableProps> = ({ headers, rows, caption }) => {
  if (rows.length === 0) {
    return <p className="text-[var(--kraft-muted-text-light)] dark:text-[var(--kraft-muted-text-dark)] italic">No data to display.</p>;
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg border border-[var(--kraft-border-light)] dark:border-[var(--kraft-border-dark)] bg-[var(--kraft-card-bg-light)] dark:bg-[var(--kraft-card-bg-dark)]">
      <table className="w-full text-sm text-left text-[var(--kraft-text-light)] dark:text-[var(--kraft-text-dark)]">
        {caption && (
          <caption className="p-5 text-lg font-semibold text-left text-[var(--kraft-text-light)] dark:text-[var(--kraft-text-dark)] bg-[var(--kraft-card-bg-light)] dark:bg-[var(--kraft-card-bg-dark)] font-special">
            {caption}
          </caption>
        )}
        <thead className="text-xs text-[var(--kraft-text-light)] dark:text-[var(--kraft-text-dark)] uppercase bg-[var(--kraft-button-bg-light)] dark:bg-[var(--kraft-button-bg-dark)]">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 font-normal">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="border-b border-[var(--kraft-border-light)] dark:border-[var(--kraft-border-dark)] hover:bg-[var(--kraft-button-hover-bg-light)] dark:hover:bg-[var(--kraft-button-hover-bg-dark)] transition-colors"
            >
              {headers.map((header) => (
                <td key={`${rowIndex}-${header}`} className="px-6 py-4">
                  {typeof row[header] === 'number' ? row[header] : (row[header] !== undefined && row[header] !== null ? String(row[header]) : 'N/A')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;