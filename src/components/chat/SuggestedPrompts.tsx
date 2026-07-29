import React from 'react';
import { Sparkles } from 'lucide-react';

export interface SuggestedPromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ prompts, onSelect }) => {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 my-3">
      <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mr-1">
        <Sparkles className="h-3 w-3" />
        <span>Suggested Alerts:</span>
      </div>
      {prompts.map((p, i) => (
        <button
          key={i}
          onClick={() => onSelect(p)}
          className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700 transition-all text-left truncate max-w-xs shadow-2xs"
        >
          {p}
        </button>
      ))}
    </div>
  );
};
