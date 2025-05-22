import React, { useState, useCallback } from 'react';
import { parseCsv, parseExcel } from '../utils/fileParser';
import { ParsedData } from '../types';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

interface FileUploadProps {
  onDataParsed: (data: ParsedData, fileName: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataParsed, setLoading, setError, isLoading, error }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      let parsedData: ParsedData;
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const text = await file.text();
        parsedData = parseCsv(text);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // .xlsx
        file.type === 'application/vnd.ms-excel' || // .xls
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls')
      ) {
        const arrayBuffer = await file.arrayBuffer();
        parsedData = parseExcel(arrayBuffer);
      } else {
        throw new Error('Unsupported file type. Please upload a CSV or Excel file.');
      }
      
      if (parsedData.length === 0) {
          throw new Error('File is empty or could not be parsed correctly.');
      }

      onDataParsed(parsedData, file.name);
    } catch (e: any) {
      console.error("File parsing error:", e);
      setError(e.message || 'Error parsing file.');
      onDataParsed([], file.name); // Clear previous data on error
    } finally {
      setLoading(false);
      // Reset file input to allow re-uploading the same file
      event.target.value = ''; 
    }
  }, [onDataParsed, setLoading, setError]);

  return (
    <div className="p-6 bg-[var(--kraft-card-bg-light)] dark:bg-[var(--kraft-card-bg-dark)] shadow-lg rounded-lg border border-[var(--kraft-border-light)] dark:border-[var(--kraft-border-dark)] bg-opacity-75 dark:bg-opacity-75 backdrop-blur-sm"
         style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.02) 100%)' }}>
      <h2 className="text-2xl font-semibold mb-4 text-[var(--kraft-text-light)] dark:text-[var(--kraft-text-dark)] font-special leading-tight">
        Upload Data File
        <br />
        <span className="text-xl">上傳資料檔案</span>
        </h2>
      <label 
        htmlFor="file-upload" 
        className="block mb-2 text-sm font-medium text-[var(--kraft-muted-text-light)] dark:text-[var(--kraft-muted-text-dark)] font-special leading-normal"
      >
        Choose a CSV or Excel file (.csv, .xls, .xlsx):
        <br />
        <span className="font-sans font-normal normal-case text-xs">選擇 CSV 或 Excel 檔案 (.csv, .xls, .xlsx):</span>
      </label>
      <input 
        id="file-upload"
        type="file" 
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={handleFileChange}
        className="block w-full text-sm text-[var(--kraft-muted-text-light)] dark:text-[var(--kraft-muted-text-dark)] font-special
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border file:border-[var(--kraft-border-light)] dark:file:border-[var(--kraft-border-dark)]
                   file:text-sm file:font-semibold file:font-special
                   file:bg-[var(--kraft-button-bg-light)] file:text-[var(--kraft-button-text-light)]
                   dark:file:bg-[var(--kraft-button-bg-dark)] dark:file:text-[var(--kraft-button-text-dark)]
                   hover:file:bg-[var(--kraft-button-hover-bg-light)] dark:hover:file:bg-[var(--kraft-button-hover-bg-dark)]
                   cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--kraft-accent-light)]"
        disabled={isLoading}
      />
      {fileName && !isLoading && !error && (
        <p className="mt-2 text-sm text-[var(--kraft-muted-text-light)] dark:text-[var(--kraft-muted-text-dark)] leading-normal">
          Uploaded: {fileName}
          <br />
          <span className="text-xs">已上傳: {fileName}</span>
        </p>
      )}
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default FileUpload;