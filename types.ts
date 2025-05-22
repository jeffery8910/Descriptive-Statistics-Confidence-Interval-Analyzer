
export interface DataRow {
  [key: string]: string | number;
}

export interface DescriptiveStats {
  variable: string;
  count: number;
  mean: string;
  median: string;
  mode: string;
  stdDev: string;
  variance: string;
  min: string;
  max: string;
  range: string;
}

// ZValueEntry interface removed as ZValueTable is removed.

export type ParsedData = DataRow[];

export interface ConfidenceIntervalData {
  lower: string;
  upper: string;
}

export interface ConfidenceIntervalStat {
  variable: string;
  mean: string;
  sem: string;
  ci90: ConfidenceIntervalData | string; // Can be string for 'N/A'
  ci95: ConfidenceIntervalData | string;
  ci99: ConfidenceIntervalData | string;
  count: number; // Keep count for conditional rendering
}