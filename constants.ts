import { ButtonConfig } from './types';

export const STANDARD_KEYS: ButtonConfig[] = [
  { label: 'C', value: 'clear', type: 'action', className: 'text-red-400' },
  { label: '(', value: '(', type: 'operator', className: 'text-cyan-400' },
  { label: ')', value: ')', type: 'operator', className: 'text-cyan-400' },
  { label: '÷', value: '/', type: 'operator', className: 'text-cyan-400' },
  
  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '×', value: '*', type: 'operator', className: 'text-cyan-400' },
  
  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '-', value: '-', type: 'operator', className: 'text-cyan-400' },
  
  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator', className: 'text-cyan-400' },
  
  { label: '0', value: '0', type: 'number', span: 2 },
  { label: '.', value: '.', type: 'number' },
  { label: '=', value: '=', type: 'action', className: 'bg-cyan-600 text-white hover:bg-cyan-500 border-none' },
];

export const SCIENTIFIC_KEYS: ButtonConfig[] = [
  { label: 'sin', value: 'sin(', type: 'function', className: 'text-emerald-400 text-sm' },
  { label: 'cos', value: 'cos(', type: 'function', className: 'text-emerald-400 text-sm' },
  { label: 'tan', value: 'tan(', type: 'function', className: 'text-emerald-400 text-sm' },
  { label: 'deg', value: 'deg', type: 'function', className: 'text-gray-400 text-xs' }, // Placeholder for mode toggle logic if extended

  { label: 'ln', value: 'log(', type: 'function', className: 'text-emerald-400 text-sm' },
  { label: 'log', value: 'log10(', type: 'function', className: 'text-emerald-400 text-sm' },
  { label: '√', value: 'sqrt(', type: 'function', className: 'text-emerald-400' },
  { label: '^', value: '^', type: 'operator', className: 'text-cyan-400' },

  { label: 'π', value: 'pi', type: 'number', className: 'text-yellow-400' },
  { label: 'e', value: 'e', type: 'number', className: 'text-yellow-400' },
  { label: 'abs', value: 'abs(', type: 'function', className: 'text-emerald-400 text-sm' },
  { label: 'mod', value: '%', type: 'operator', className: 'text-cyan-400 text-sm' },
];
