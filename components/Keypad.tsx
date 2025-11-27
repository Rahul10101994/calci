import React from 'react';
import { ButtonConfig } from '../types';
import { STANDARD_KEYS, SCIENTIFIC_KEYS } from '../constants';

interface KeypadProps {
  onPress: (value: string, type: ButtonConfig['type']) => void;
  isScientific: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({ onPress, isScientific }) => {
  
  const renderButton = (btn: ButtonConfig) => (
    <button
      key={btn.value}
      onClick={() => onPress(btn.value, btn.type)}
      className={`
        relative overflow-hidden
        h-14 sm:h-16 rounded-xl 
        text-xl sm:text-2xl font-medium
        transition-all duration-150 active:scale-95
        ${btn.span === 2 ? 'col-span-2 w-full' : 'w-full'}
        ${btn.className || 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700/50'}
        shadow-lg shadow-black/20
      `}
    >
      {btn.label}
    </button>
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {isScientific && (
        <div className="grid grid-cols-4 sm:grid-cols-3 gap-3 w-full sm:w-2/5 mb-3 sm:mb-0">
           {SCIENTIFIC_KEYS.map(renderButton)}
        </div>
      )}
      <div className={`grid grid-cols-4 gap-3 w-full ${isScientific ? 'sm:w-3/5' : 'w-full'}`}>
        {STANDARD_KEYS.map(renderButton)}
      </div>
    </div>
  );
};