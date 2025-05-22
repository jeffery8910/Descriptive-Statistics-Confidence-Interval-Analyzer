
import { ParsedData, DataRow } from '../types';

declare var XLSX: any; // XLSX is loaded from CDN

export const parseCsv = (csvText: string): ParsedData => {
  const lines = csvText.trim().split(/\r\n|\n/);
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(header => header.trim());
  const data: ParsedData = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue; // Skip empty lines
    const values = lines[i].split(',');
    const row: DataRow = {};
    headers.forEach((header, index) => {
      const value = values[index] ? values[index].trim() : '';
      const numValue = parseFloat(value);
      row[header] = !isNaN(numValue) && value !== '' ? numValue : value;
    });
    data.push(row);
  }
  return data;
};

export const parseExcel = (arrayBuffer: ArrayBuffer): ParsedData => {
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  // Fix: Removed type argument from XLSX.utils.sheet_to_json as XLSX is declared as 'any'.
  // Explicitly type jsonData to any[] as sheet_to_json on an 'any' typed XLSX will return 'any'.
  // The subsequent map function will process these 'any' objects into DataRow[].
  const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { rawNumbers: false });
  
  // Attempt to convert string numbers to actual numbers
  return jsonData.map(row => {
    const newRow: DataRow = {};
    for (const key in row) {
        const value = row[key];
        if (typeof value === 'string') {
            const numValue = parseFloat(value);
            newRow[key] = !isNaN(numValue) && value.trim() !== '' ? numValue : value;
        } else {
            newRow[key] = value;
        }
    }
    return newRow;
  });
};
