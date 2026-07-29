'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchFormProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  placeholder = 'Search items...',
  onSearch,
  className,
}) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative w-full ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-9 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-0.5"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
