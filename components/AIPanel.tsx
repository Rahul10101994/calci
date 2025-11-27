import React, { useState, useRef, useEffect } from 'react';
import { solveMathWithGemini } from '../services/geminiService';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';
import { HistoryItem } from '../types';

interface AIPanelProps {
  onResult: (expression: string, result: string) => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({ onResult }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsLoading(true);

    try {
      const result = await solveMathWithGemini(userQuery);
      setMessages(prev => [...prev, { role: 'ai', content: result }]);
      
      // Add to main calculator history implicitly via callback if needed, 
      // but for now we just keep it in chat. 
      // Optionally extract final number to calculator display? 
      // Let's just notify parent a calculation happened.
      onResult(userQuery, "See AI Chat"); 
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-gray-800 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <Sparkles className="text-purple-400" size={20} />
        <h2 className="font-medium text-white">AI Math Assistant</h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 opacity-60">
                <Bot size={48} />
                <div className="text-center">
                    <p className="text-sm">Ask complex math questions.</p>
                    <p className="text-xs mt-1">"Calculate the area of a circle with radius 5"</p>
                </div>
            </div>
        )}
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                }
              `}
            >
               {/* Simple Markdown parser for bolding */}
               {msg.content.split('**').map((part, i) => 
                 i % 2 === 1 ? <strong key={i} className="text-cyan-300 font-bold">{part}</strong> : part
               )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none border border-gray-700 flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 size={16} className="animate-spin" /> Thinking...
             </div>
           </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-800 bg-gray-900/80">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me a math problem..."
            className="w-full bg-gray-800 text-white placeholder-gray-500 pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-transparent focus:border-indigo-500 transition-all"
          />
          <button 
            type="button"
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};