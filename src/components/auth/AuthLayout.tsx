'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Sun, Moon } from 'lucide-react';
import { AuthIllustration } from './AuthIllustration';
import { useThemeStore } from '@/store/theme-store';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row selection:bg-blue-500 selection:text-white transition-colors duration-300">
      {/* Left Column: Brand & Hero Graphic (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-100/80 dark:bg-slate-900/60 border-r border-slate-200/80 dark:border-slate-800/80 relative flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
            <Bot className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white text-xl tracking-wide">Runbook Agent</span>
        </Link>

        <AuthIllustration />

        <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center font-mono font-medium">
          <span>© 2026 Runbook Following Agent</span>
          <span>Enterprise SRE Edition</span>
        </div>
      </div>

      {/* Right Column: Form Box */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 max-w-xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex lg:hidden items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base">Runbook Agent</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 ml-auto transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>
        </div>

        {/* Center Card Content */}
        <div className="my-auto py-8 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl space-y-6 text-slate-900 dark:text-slate-100">
            {children}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Encrypted with 256-bit SSL | SOC-2 Type II Compliant
        </div>
      </div>
    </div>
  );
};
