'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Command, X, BookOpen, Activity, FileText, Cpu, Settings, Shield, HelpCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchItem {
  id: string;
  title: string;
  category: 'Runbooks' | 'Incidents' | 'Commands' | 'Pages' | 'Settings' | 'Help';
  href: string;
  description: string;
  icon: any;
}

const SEARCH_DATABASE: SearchItem[] = [
  { id: '1', title: 'PostgreSQL High Availability Recovery', category: 'Runbooks', href: '/dashboard/runbooks', description: 'Failover procedure for PostgreSQL primary cluster failures', icon: BookOpen },
  { id: '2', title: 'Kubernetes Pod OOMKilled Fix', category: 'Runbooks', href: '/dashboard/runbooks', description: 'Memory leak diagnostic and autoscaler scaling', icon: BookOpen },
  { id: '3', title: 'Nginx SSL & Proxy Renewal', category: 'Runbooks', href: '/dashboard/runbooks', description: 'HTTP 502 fix and certbot renewal execution', icon: BookOpen },
  { id: '4', title: 'INC-2026-8941 Database Outage', category: 'Incidents', href: '/dashboard/execution', description: 'Critical database latency and connection pool exhaustion', icon: Activity },
  { id: '5', title: 'INC-2026-9042 K8s Pod CrashLoop', category: 'Incidents', href: '/dashboard/execution', description: 'High memory usage causing pod evictions', icon: Activity },
  { id: '6', title: 'kubectl restart deployment/postgres', category: 'Commands', href: '/dashboard/chat', description: 'Force restart primary database deployment', icon: Activity },
  { id: '7', title: 'systemctl status postgresql', category: 'Commands', href: '/dashboard/chat', description: 'Check database daemon service status', icon: Activity },
  { id: '8', title: 'AI Copilot Chat Console', category: 'Pages', href: '/dashboard/chat', description: 'Interactive AI Incident Resolution Copilot', icon: Cpu },
  { id: '9', title: 'SRE Analytics & Performance', category: 'Pages', href: '/dashboard/analytics', description: 'System health, AI performance metrics, and graphs', icon: Activity },
  { id: '10', title: 'Security & Access Control', category: 'Settings', href: '/dashboard/settings/security', description: 'Multi-factor auth, API keys, and session tokens', icon: Settings },
  { id: '11', title: 'Admin User Management', category: 'Settings', href: '/dashboard/admin/users', description: 'Manage organization users and role permissions', icon: Shield },
  { id: '12', title: 'Help & API Documentation', category: 'Help', href: '/help/docs', description: 'Developer docs, tutorials, and system status', icon: HelpCircle },
];

export const SearchBarModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'PostgreSQL High Availability',
    'Kubernetes OOMKilled',
    'AI Operations Fleet',
  ]);
  const router = useRouter();

  // Listen for Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter items based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return SEARCH_DATABASE.slice(0, 5);
    return SEARCH_DATABASE.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Handle arrow key navigation & Enter key
  const handleKeyDownModal = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
      e.preventDefault();
      const target = filteredResults[selectedIndex];
      if (query) {
        setRecentSearches((prev) => [query, ...prev.filter((q) => q !== query)].slice(0, 5));
      }
      setIsOpen(false);
      router.push(target.href);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-sm hidden sm:flex items-center gap-2 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-slate-100/70 dark:bg-slate-900/60 px-3.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:border-blue-500/40 dark:hover:border-blue-500/50 transition-colors shadow-2xs group"
      >
        <Search className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
        <span className="font-medium truncate">Search runbooks, incidents, commands...</span>
        <kbd className="ml-auto flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-2xs">
          <Command className="h-3 w-3" /> K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-2xl rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 shadow-2xl overflow-hidden backdrop-blur-xl z-10 text-slate-900 dark:text-slate-100 flex flex-col max-h-[80vh]"
              onKeyDown={handleKeyDownModal}
            >
              {/* Search Header Input */}
              <div className="relative flex items-center border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3.5">
                <Search className="h-5 w-5 text-blue-500 mr-3 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search entire application (Runbooks, Incidents, Commands, Help)..."
                  className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2 p-1 rounded-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  ESC
                </button>
              </div>

              {/* Results List */}
              <div className="overflow-y-auto p-3 space-y-3 flex-1 scrollbar-thin">
                {recentSearches.length > 0 && !query && (
                  <div className="px-2 pt-1 pb-2">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold mb-2">Recent Searches</p>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => setQuery(term)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="px-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold mb-1">
                    {query ? `Search Results (${filteredResults.length})` : 'Top Suggestions'}
                  </p>

                  {filteredResults.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      No matching records found for "{query}"
                    </div>
                  ) : (
                    filteredResults.map((res, i) => {
                      const Icon = res.icon;
                      const isSelected = i === selectedIndex;
                      return (
                        <Link
                          key={res.id}
                          href={res.href}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                          className={cn(
                            'flex items-center justify-between p-3 rounded-xl transition-all duration-150 group',
                            isSelected
                              ? 'bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 shadow-xs'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-500'
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                  {res.title}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                  {res.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                                {res.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-500">
                            {isSelected && <CornerDownLeft className="h-4 w-4" />}
                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Footer Hotkey Guidance */}
              <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-2 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">↵</kbd> Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">ESC</kbd> Close
                  </span>
                </div>
                <span>Module 16 Global Index</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
