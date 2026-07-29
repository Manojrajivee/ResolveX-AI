'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_ITEMS } from '@/constants/sidebar';
import { useSidebar } from '@/hooks/useSidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Bot, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isOpen, isCollapsed, toggleCollapse, closeSidebar } = useSidebar();
  const { isAdmin } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 shadow-xl shadow-slate-200/50 dark:shadow-none',
          isCollapsed ? 'w-20' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-blue-500/25">
              <Bot className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-wide text-sm whitespace-nowrap">Runbook Agent</span>
                <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-mono tracking-wider uppercase font-bold">AI Incident SRE</span>
              </div>
            )}
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
          {SIDEBAR_ITEMS.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group relative',
                  isActive
                    ? 'bg-blue-500/10 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/80'
                )}
              >
                <Icon className={cn('h-5 w-5 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white')} />
                
                {!isCollapsed && <span className="truncate">{item.title}</span>}

                {!isCollapsed && item.badge && (
                  <Badge variant={isActive ? 'info' : 'neutral'} size="sm" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}

                {/* Tooltip for collapsed view */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl border border-slate-800">
                    {item.title}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Collapse Toggle */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 hidden lg:block">
          <button
            onClick={toggleCollapse}
            className="flex w-full items-center justify-center py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </aside>
    </>
  );
};
