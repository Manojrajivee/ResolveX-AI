'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { KeyboardShortcutsHandler } from '@/components/layout/KeyboardShortcutsHandler';
import { useSidebarStore } from '@/hooks/useSidebar';
import { motion } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <KeyboardShortcutsHandler />
      <Sidebar />
      <Navbar />

      <main
        className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
