
import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import StatisticsTable from './components/StatisticsTable';
// ZValueTable import removed
import RawDataTable from './components/RawDataTable';
import ConfidenceIntervalTable from './components/ConfidenceIntervalTable'; 
import { ParsedData } from './types';

const App: React.FC = () => {
  const [parsedData, setParsedData] = useState<ParsedData>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [isRawDataVisible, setIsRawDataVisible] = useState<boolean>(false);

  const handleDataParsed = useCallback((data: ParsedData, fileName: string) => {
    setParsedData(data);
    setCurrentFileName(fileName);
    if (data.length > 0) {
        setError(null);
        setIsRawDataVisible(false); // Collapse raw data on new file load
    } else {
        setIsRawDataVisible(false); // Also collapse if data is empty (e.g. error during parse)
    }
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-serif">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[var(--kraft-accent-light)] dark:text-[var(--kraft-accent-dark)] font-special leading-tight">
          Descriptive Statistics &amp; Confidence Interval Analyzer
          <br />
          <span className="text-3xl">描述性統計與信賴區間分析器</span>
        </h1>
        <p className="text-md text-[var(--kraft-muted-text-light)] dark:text-[var(--kraft-muted-text-dark)] mt-3 leading-relaxed">
          Upload a CSV or Excel file to analyze its descriptive statistics and confidence intervals.
          <br />
          上傳 CSV 或 Excel 檔案以分析其描述性統計數據和信賴區間。
        </p>
      </header>

      <main>
        <FileUpload 
          onDataParsed={handleDataParsed} 
          setLoading={setIsLoading}
          setError={setError}
          isLoading={isLoading}
          error={error}
        />

        {/* Toggle button for Raw Data Table */}
        {!isLoading && parsedData.length > 0 && currentFileName && (
          <div className="mt-6 mb-2 text-center sm:text-left">
            <button
              onClick={() => setIsRawDataVisible(!isRawDataVisible)}
              className="px-4 py-2 text-sm font-medium bg-[var(--kraft-button-bg-light)] text-[var(--kraft-button-text-light)] rounded-md hover:bg-[var(--kraft-button-hover-bg-light)] dark:bg-[var(--kraft-button-bg-dark)] dark:text-[var(--kraft-button-text-dark)] dark:hover:bg-[var(--kraft-button-hover-bg-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--kraft-accent-light)] dark:focus:ring-offset-[var(--kraft-bg-dark)] flex flex-col sm:flex-row items-center justify-center sm:justify-start w-full sm:w-auto font-special leading-normal"
              aria-expanded={isRawDataVisible}
              aria-controls="raw-data-content"
            >
              <span className="flex items-center">
                {isRawDataVisible ? 'Hide' : 'Show'} Raw Data from {currentFileName}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 ml-2 transform transition-transform ${isRawDataVisible ? 'rotate-180' : 'rotate-0'}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="block sm:ml-2 text-xs font-sans font-normal normal-case opacity-90">
                ({isRawDataVisible ? '隱藏' : '顯示'}來自 {currentFileName} 的原始數據)
              </span>
            </button>
          </div>
        )}

        {/* Display Raw Data Table (Collapsible) */}
        {isRawDataVisible && !isLoading && parsedData.length > 0 && (
          <div id="raw-data-content" className="transition-all duration-300 ease-in-out">
            <RawDataTable data={parsedData} fileName={currentFileName} />
          </div>
        )}

        {/* Conditionally render StatisticsTable only if there's data and no critical error during parsing */}
        {!isLoading && parsedData.length > 0 && (
          <StatisticsTable data={parsedData} fileName={currentFileName} />
        )}

        {/* Render ConfidenceIntervalTable if data is available */}
        {!isLoading && parsedData.length > 0 && (
          <ConfidenceIntervalTable data={parsedData} fileName={currentFileName} />
        )}
        
        {/* Display error from FileUpload if it occurred and no data could be shown */}
        {error && parsedData.length === 0 && (
           <div className="mt-8 p-6 bg-[var(--kraft-card-bg-light)] dark:bg-[var(--kraft-card-bg-dark)] shadow-lg rounded-lg border border-[var(--kraft-border-light)] dark:border-[var(--kraft-border-dark)]">
             <h2 className="text-2xl font-semibold mb-4 text-[var(--kraft-error-text-light)] dark:text-[var(--kraft-error-text-dark)] font-special leading-tight">
                Analysis Error
                <br />
                <span className="text-xl">分析錯誤</span>
                </h2>
             <p className="text-[var(--kraft-text-light)] dark:text-[var(--kraft-text-dark)]">{error}</p>
           </div>
        )}

        {/* ZValueTable removed */}
      </main>

      <footer className="text-center mt-12 py-6 border-t border-[var(--kraft-border-light)] dark:border-[var(--kraft-border-dark)]">
        <p className="text-sm text-[var(--kraft-muted-text-light)] dark:text-[var(--kraft-muted-text-dark)] leading-relaxed">
          &copy; {new Date().getFullYear()} Descriptive Statistics &amp; Confidence Interval Analyzer.
          <br />
          描述性統計與信賴區間分析器。
        </p>
      </footer>
    </div>
  );
};

export default App;