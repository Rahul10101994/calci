import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorMode, HistoryItem, ButtonConfig } from './types';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { History } from './components/History';
import { AIPanel } from './components/AIPanel';
import { Calculator, History as HistoryIcon, Sparkles, FlaskConical, Delete } from 'lucide-react';

const safeCalculate = (expr: string, isRadians: boolean): string => {
  try {
    // Sanitize: Allow only numbers, operators, parens, and known function names
    // We do NOT replace sin/cos strings here, we pass them as variables to the function scope
    // This avoids regex issues and partial matches (like log vs log10)
    let cleanExpr = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/pi/g, 'Math.PI')
      .replace(/\be\b/g, 'Math.E')
      .replace(/\^/g, '**');

    // Basic validation to prevent arbitrary code execution
    // Allow digits, operators, parens, dot, whitespace, and letters (for function names)
    if (/[^0-9+\-*/().\s a-z%**,]/gi.test(cleanExpr)) {
        return "Error";
    }

    // Define Math functions with Angle Mode support
    const sin = (x: number) => isRadians ? Math.sin(x) : Math.sin(x * Math.PI / 180);
    const cos = (x: number) => isRadians ? Math.cos(x) : Math.cos(x * Math.PI / 180);
    const tan = (x: number) => isRadians ? Math.tan(x) : Math.tan(x * Math.PI / 180);
    const log = Math.log;   // ln
    const log10 = Math.log10; // log base 10
    const sqrt = Math.sqrt;
    const abs = Math.abs;

    // Create a function with restricted scope, passing our safe math functions
    const func = new Function(
      'sin', 'cos', 'tan', 'log', 'log10', 'sqrt', 'abs',
      `return ${cleanExpr}`
    );
    
    // Execute
    const result = func(sin, cos, tan, log, log10, sqrt, abs);
    
    if (!isFinite(result) || isNaN(result)) return "Error";
    
    // Format: max 8 decimals, remove trailing zeros
    return parseFloat(result.toFixed(8)).toString();
  } catch (e) {
    return "Error";
  }
};

export default function App() {
  const [mode, setMode] = useState<CalculatorMode>(CalculatorMode.STANDARD);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isRadians, setIsRadians] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleKeyPress = useCallback((value: string, type: ButtonConfig['type']) => {
    if (type === 'action') {
      if (value === 'clear') {
        setExpression('');
        setResult('');
      } else if (value === '=') {
        if (!expression) return;
        const calcResult = safeCalculate(expression, isRadians);
        setResult(calcResult);
        
        if (calcResult !== 'Error') {
          const newItem: HistoryItem = {
            id: Date.now().toString(),
            expression,
            result: calcResult,
            timestamp: Date.now(),
            type: 'calculation'
          };
          setHistory(prev => [newItem, ...prev].slice(0, 50));
        }
      } else if (value === 'toggle_rad') {
        setIsRadians(prev => !prev);
      }
    } else {
      if (result && type === 'number' && !expression) {
         setResult('');
      }
      
      if (result && !expression && (type === 'operator' || type === 'function')) {
        setExpression(result + value);
        setResult('');
        return;
      }

      if (result && expression === '') {
         setResult('');
      }

      setExpression(prev => prev + value);
    }
  }, [expression, result, isRadians]);

  const handleHistorySelect = (item: HistoryItem) => {
    if (item.type === 'calculation') {
      setExpression(item.expression);
      setResult(item.result);
    }
  };

  const handleAIResult = (query: string, answer: string) => {
      const newItem: HistoryItem = {
          id: Date.now().toString(),
          expression: query,
          result: "AI Generated",
          timestamp: Date.now(),
          type: 'ai'
      };
      setHistory(prev => [newItem, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 gap-4 font-sans bg-[#0b0f19]">
      
      <div className="w-full max-w-md flex flex-col gap-4 z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md p-2 rounded-2xl border border-gray-800 shadow-lg">
           <div className="flex gap-1">
              <button 
                onClick={() => setMode(CalculatorMode.STANDARD)}
                className={`p-2 rounded-xl transition-all ${mode === CalculatorMode.STANDARD ? 'bg-gray-800 text-cyan-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                title="Standard"
              >
                <Calculator size={20} />
              </button>
              <button 
                onClick={() => setMode(CalculatorMode.SCIENTIFIC)}
                className={`p-2 rounded-xl transition-all ${mode === CalculatorMode.SCIENTIFIC ? 'bg-gray-800 text-cyan-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                title="Scientific"
              >
                <FlaskConical size={20} />
              </button>
              <button 
                onClick={() => setMode(CalculatorMode.AI)}
                className={`p-2 rounded-xl transition-all ${mode === CalculatorMode.AI ? 'bg-indigo-900/50 text-indigo-400 shadow-sm ring-1 ring-indigo-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                title="AI Assistant"
              >
                <Sparkles size={20} />
              </button>
           </div>
           
           <div className="flex gap-2 lg:hidden">
              <button 
                 onClick={() => setShowSidebar(!showSidebar)}
                 className={`p-2 rounded-xl transition-colors ${showSidebar ? 'bg-gray-800 text-white' : 'text-gray-500'}`}
              >
                <HistoryIcon size={20} />
              </button>
           </div>
           <div className="hidden lg:block px-3 text-gray-500 text-sm font-medium tracking-widest">
              GENCALC
           </div>
        </div>

        <Display 
          expression={expression} 
          result={result} 
          isRadians={isRadians}
          showMode={mode === CalculatorMode.SCIENTIFIC}
        />
        
        {mode === CalculatorMode.AI ? (
           <div className="h-[450px] sm:h-[500px]">
              <AIPanel onResult={handleAIResult} />
           </div>
        ) : (
           <Keypad 
             onPress={handleKeyPress} 
             isScientific={mode === CalculatorMode.SCIENTIFIC} 
           />
        )}
      </div>

      <div className={`
          fixed inset-y-0 right-0 w-80 bg-[#0b0f19]/95 backdrop-blur-xl border-l border-gray-800 p-4 transform transition-transform duration-300 z-20
          lg:relative lg:translate-x-0 lg:bg-transparent lg:border-none lg:w-80 lg:h-[700px] lg:block
          ${showSidebar ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
      `}>
         <div className="flex lg:hidden justify-end mb-4">
            <button onClick={() => setShowSidebar(false)} className="p-2 text-gray-400">
               <Delete size={24} />
            </button>
         </div>
         <History 
            history={history} 
            onSelect={(item) => {
                handleHistorySelect(item);
                if (window.innerWidth < 1024) setShowSidebar(false);
            }}
            onClear={() => setHistory([])}
         />
      </div>

      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden backdrop-blur-sm"
          onClick={() => setShowSidebar(false)}
        />
      )}

    </div>
  );
}