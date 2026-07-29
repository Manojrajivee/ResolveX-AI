'use client';

import React, { useState, useEffect } from 'react';
import { Search, Command, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const SearchBarModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-sm hidden sm:flex items-center gap-2 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-slate-100/70 dark:bg-slate-900/60 px-3.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:border-blue-500/40 dark:hover:border-blue-500/50 transition-colors shadow-2xs"
      >
        <Search className="h-4 w-4 text-slate-400" />
        <span className="font-medium truncate">Search runbooks, incidents, commands...</span>
        <kbd className="ml-auto flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-2xs">
          <Command className="h-3 w-3" /> K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-2xl rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-4 space-y-4 backdrop-blur-xl z-10 text-slate-900 dark:text-slate-100"
            >
              <div className="relative flex items-center border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                <Search className="h-5 w-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search runbooks, commands, incidents..."
                  className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Quick Suggestions</p>
                {[
                  { title: 'PostgreSQL High Availability Recovery', type: 'Runbook', href: '/runbooks' },
                  { title: 'INC-2026-8941 Live Timeline Log', type: 'Incident', href: '/timeline' },
                  { title: 'systemctl restart postgresql', type: 'Command', href: '/chat' },
                ].map((res, i) => (
                  <Link
                    key={i}
                    href={res.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{res.title}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-slate-800 text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-slate-700">
                      {res.type}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
