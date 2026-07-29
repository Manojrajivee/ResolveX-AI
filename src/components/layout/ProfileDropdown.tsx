'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { Avatar } from '../ui/Avatar';
import { User, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-3 border-l border-slate-200/80 dark:border-slate-800/80 focus:outline-none group"
      >
        <Avatar name={user?.name || 'Alex Mercer'} src={user?.avatarUrl} size="sm" />
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {user?.name || 'Alex Mercer'}
          </span>
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">{user?.role || 'ENGINEER'}</span>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 z-50 w-60 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-2 space-y-1 backdrop-blur-xl text-xs text-slate-900 dark:text-slate-100"
            >
              <div className="p-3 border-b border-slate-200/80 dark:border-slate-800/80 space-y-1 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl mb-1">
                <p className="font-bold leading-none">{user?.name || 'Alex Mercer'}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email || 'alex.mercer@enterprise.io'}</p>
              </div>

              <Link
                href="/dashboard/settings/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
              >
                <User className="h-4 w-4 text-blue-500" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
              >
                <Settings className="h-4 w-4 text-cyan-500" />
                <span>Platform Settings</span>
              </Link>

              <div className="pt-1 border-t border-slate-200/80 dark:border-slate-800/80">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-semibold transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
