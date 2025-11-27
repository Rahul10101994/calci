import React from 'react';

interface DisplayProps {
  expression: string;
  result: string;
  className?: string;
  isRadians?: boolean;
  showMode?: boolean;
}

export const Display: React.FC<DisplayProps> = ({ 
  expression, 
  result, 
  className = '', 
  isRadians = true,
  showMode = false
}) => {
  return (
    <div className={`relative flex flex-col justify-end items-end p-6 bg-gray-900 rounded-2xl mb-4 shadow-inner ring-1 ring-gray-800 min-h-[140px] ${className}`}>
      
      {showMode && (
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded ${isRadians ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800' : 'bg-gray-800 text-gray-500 border border-transparent'}`}>
            RAD
          </span>
          <span className={`ml-1 text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded ${!isRadians ? 'bg-amber-900/50 text-amber-400 border border-amber-800' : 'bg-gray-800 text-gray-500 border border-transparent'}`}>
            DEG
          </span>
        </div>
      )}

      <div className="text-gray-400 text-sm font-mono break-all text-right w-full min-h-[1.5rem] mt-4">
        {expression || '\u00A0'}
      </div>
      <div className="text-white text-5xl font-light tracking-tight mt-2 break-all text-right w-full overflow-hidden text-ellipsis">
        {result || '0'}
      </div>
    </div>
  );
};