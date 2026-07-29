'use client';

import React from 'react';
import { useSidebarStore } from '@/hooks/useSidebar';
import { useThemeStore } from '@/store/theme-store';
import { Menu, Sun, Moon, Sparkles } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { SearchBarModal } from './SearchBarModal';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { toggleOpen, isCollapsed } = useSidebarStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 px-4 lg:px-6 backdrop-blur-2xl transition-all duration-300 ${
        isCollapsed ? 'lg:pl-24' : 'lg:pl-68'
      }`}
    >
      {/* Mobile Menu & Global Command Palette Trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={toggleOpen}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <SearchBarModal />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Sandbox Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-500" />
            MCP Sandbox Active
          </span>
        </div>

        {/* Theme Switcher Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-amber-400 drop-shadow-sm" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-600 drop-shadow-sm" />
          )}
        </motion.button>

        {/* Notification Bell Dropdown */}
        <NotificationDropdown />

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
};
