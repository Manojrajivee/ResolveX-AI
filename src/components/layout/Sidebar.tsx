'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_SECTIONS, SidebarItem } from '@/constants/sidebar';
import { useSidebar } from '@/hooks/useSidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Bot, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isOpen, isCollapsed, toggleCollapse, closeSidebar } = useSidebar();
  const { isAdmin } = useAuth();

  // Track expanded submenus
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    '/dashboard/runbooks': true,
    '/dashboard/chat': true,
    '/dashboard/analytics': true,
  });

  const toggleSubmenu = (href: string) => {
    setExpandedItems((prev) => ({ ...prev, [href]: !prev[href] }));
  };

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
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2E5E7A] to-[#8A6636] text-white font-bold font-sora text-sm shadow-md">
              R×
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-wide text-sm whitespace-nowrap font-sora">ResolveX AI</span>
                <span className="text-[10px] text-[#8A6636] dark:text-[#E7D3B2] font-mono tracking-wider uppercase font-bold">Enterprise SOP</span>
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

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {SIDEBAR_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {section.heading}
                </h3>
              )}
              {section.items.map((item) => {
                if (item.adminOnly && !isAdmin) return null;

                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href)) ||
                  (item.href === '/dashboard/runbooks' && pathname.startsWith('/runbooks')) ||
                  (item.href === '/dashboard/chat' && pathname.startsWith('/chat'));

                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = !!expandedItems[item.href];
                const Icon = item.icon;

                return (
                  <div key={item.href} className="space-y-1">
                    <div className="relative flex items-center">
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (hasSubItems) toggleSubmenu(item.href);
                          if (!hasSubItems) closeSidebar();
                        }}
                        className={cn(
                          'flex flex-1 items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group relative',
                          isActive
                            ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/80'
                        )}
                      >
                        {/* Active Indicator Bar */}
                        {isActive && (
                          <motion.div
                            layoutId="activeSidebarIndicator"
                            className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 dark:bg-blue-400 rounded-r-full"
                          />
                        )}

                        <Icon
                          className={cn(
                            'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                          )}
                        />

                        {!isCollapsed && <span className="truncate">{item.title}</span>}

                        {!isCollapsed && item.badge && (
                          <Badge variant={isActive ? 'info' : 'neutral'} size="sm" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}

                        {/* Collapsed Tooltip */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl border border-slate-800">
                            {item.title}
                          </div>
                        )}
                      </Link>

                      {/* Expand Chevron for sub-items */}
                      {hasSubItems && !isCollapsed && (
                        <button
                          onClick={() => toggleSubmenu(item.href)}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          <ChevronDown
                            className={cn('h-4 w-4 transition-transform duration-200', isExpanded ? 'rotate-180' : '')}
                          />
                        </button>
                      )}
                    </div>

                    {/* Submenu Accordion */}
                    {hasSubItems && !isCollapsed && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-9 pr-2 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-5"
                      >
                        {item.subItems?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={closeSidebar}
                              className={cn(
                                'flex items-center justify-between py-1.5 px-2.5 text-xs rounded-lg transition-colors font-medium',
                                isSubActive
                                  ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-900/20'
                                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
                              )}
                            >
                              <span>{sub.title}</span>
                              {sub.badge && (
                                <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono font-semibold">
                                  {sub.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Collapse Toggle */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 hidden lg:block shrink-0">
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
