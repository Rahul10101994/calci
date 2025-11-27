export enum CalculatorMode {
  STANDARD = 'STANDARD',
  SCIENTIFIC = 'SCIENTIFIC',
  AI = 'AI'
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  type: 'calculation' | 'ai';
}

export interface ButtonConfig {
  label: string;
  value: string;
  type: 'number' | 'operator' | 'action' | 'function';
  className?: string;
  span?: number; // Col span
}

export interface AIResponse {
  text: string;
  isError: boolean;
}