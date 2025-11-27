import React from 'react';

interface DisplayProps {
  expression: string;
  result: string;
  className?: string;
}

export const Display: React.FC<DisplayProps> = ({ expression, result, className = '' }) => {
  return (
    <div className={`flex flex-col justify-end items-end p-6 bg-gray-900 rounded-2xl mb-4 shadow-inner ring-1 ring-gray-800 min-h-[140px] ${className}`}>
      <div className="text-gray-400 text-sm font-mono break-all text-right w-full min-h-[1.5rem]">
        {expression || '\u00A0'}
      </div>
      <div className="text-white text-5xl font-light tracking-tight mt-2 break-all text-right w-full overflow-hidden text-ellipsis">
        {result || '0'}
      </div>
    </div>
  );
};