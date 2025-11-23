import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  onSearch: (ip: string) => void;
  isLoading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const clearInput = () => {
      setInput('');
      onSearch(''); // Trigger reset to current IP
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl mx-auto mb-8">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative flex items-center bg-slate-900 rounded-xl overflow-hidden">
             <div className="pl-4 text-slate-400">
                 <Search size={20} />
             </div>
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search any IP address (e.g., 8.8.8.8)"
                className="w-full bg-transparent border-none py-4 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-0 font-mono"
            />
            {input && (
                <button type="button" onClick={clearInput} className="p-2 text-slate-500 hover:text-white">
                    <X size={18} />
                </button>
            )}
            <button 
                type="submit"
                disabled={isLoading}
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white border-l border-slate-700 transition-colors"
            >
                {isLoading ? 'Searching...' : 'Lookup'}
            </button>
        </div>
      </div>
    </form>
  );
};