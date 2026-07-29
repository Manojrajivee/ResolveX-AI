'use client';

import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '../ui/Button';

export interface InputBoxProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-center gap-2 p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 shadow-lg backdrop-blur-xl transition-all focus-within:border-blue-500/50">
      <button
        type="button"
        className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Attach log snippet or file"
      >
        <Paperclip className="h-4 w-4" />
      </button>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe incident or ask AI Agent (e.g. Database server PostgreSQL is unresponsive)..."
        rows={1}
        disabled={disabled}
        className="flex-1 bg-transparent px-2 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none max-h-24 scrollbar-none font-medium"
      />

      <Button
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        variant="glow"
        size="sm"
        className="rounded-xl px-3.5 py-2 shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
