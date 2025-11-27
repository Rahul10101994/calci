import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2 } from 'lucide-react';

interface HistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onSelect, onClear }) => {
  return (
    <div className="flex flex-col h-full bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 text-gray-300">
          <Clock size={18} />
          <span className="font-medium">History</span>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"
            title="Clear History"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <p>No history yet</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-right p-3 rounded-xl bg-gray-800/40 hover:bg-gray-800 transition-all group border border-transparent hover:border-gray-700"
            >
              <div className="text-xs text-gray-500 mb-1 font-mono truncate">
                {item.type === 'ai' ? '✨ ' : ''}{item.expression}
              </div>
              <div className="text-lg text-cyan-50 text-opacity-90 font-medium">
                {item.type === 'ai' ? 'View Answer' : `= ${item.result}`}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};