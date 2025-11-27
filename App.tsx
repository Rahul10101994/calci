import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorMode, HistoryItem, ButtonConfig } from './types';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { History } from './components/History';
import { AIPanel } from './components/AIPanel';
import { Calculator, History as HistoryIcon, Sparkles, FlaskConical, Delete } from 'lucide-react';

const safeCalculate = (expr: string): string => {
  try {
    // Sanitize: Allow only numbers, operators, parens, and Math functions
    // Replace 'pi' with Math.PI, 'e' with Math.E
    let cleanExpr = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/pi/g, 'Math.PI')
      .replace(/\be\b/g, 'Math.E')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log(') // ln
      .replace(/log10\(/g, 'Math.log10(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/\^/g, '**');

    // Very basic validation to prevent execution of arbitrary code
    if (/[^0-9+\-*/().\sMathPIE%**,]/g.test(cleanExpr)) {
        return "Error";
    }

    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${cleanExpr}`)();
    
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
  const [showSidebar, setShowSidebar] = useState(false); // For mobile toggle

  // Handle window resize to auto-show sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleKeyPress = useCallback((value: string, type: ButtonConfig['type']) => {
    if (type === 'action') {
      if (value === 'clear') {
        setExpression('');
        setResult('');
      } else if (value === '=') {
        if (!expression) return;
        const calcResult = safeCalculate(expression);
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
      }
    } else {
      // Auto-clear previous result if starting new calculation with a number,
      // but append if starting with operator
      if (result && type === 'number' && !expression) {
         setResult(''); // Visual clear
      }
      
      // If result exists and we press operator, use result as start of new expr
      if (result && !expression && (type === 'operator' || type === 'function')) {
        setExpression(result + value);
        setResult('');
        return;
      }

      // Reset result visual if we start typing new expression
      if (result && expression === '') {
         setResult('');
      }

      setExpression(prev => prev + value);
    }
  }, [expression, result]);

  const handleHistorySelect = (item: HistoryItem) => {
    if (item.type === 'calculation') {
      setExpression(item.expression);
      setResult(item.result);
    }
  };

  const handleAIResult = (query: string, answer: string) => {
      // We don't necessarily set expression/result for AI, but add to history
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
      
      {/* Main Calculator Container */}
      <div className="w-full max-w-md flex flex-col gap-4 z-10">
        
        {/* Header / Mode Switcher */}
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

        {/* Display Area */}
        <Display expression={expression} result={result} />
        
        {/* Keypad or AI View */}
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

      {/* Sidebar (History/Info) */}
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

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden backdrop-blur-sm"
          onClick={() => setShowSidebar(false)}
        />
      )}

    </div>
  );
}