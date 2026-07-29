'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Terminal } from 'lucide-react';

export default function OperationsLogsPage() {
  const { isCollapsed } = useSidebarStore();

  const logs = [
    { time: '14:02:10.412', agent: 'PlannerAgent', level: 'INFO', msg: 'Synthesizing LangGraph execution DAG for INC-2026-8941' },
    { time: '14:02:11.890', agent: 'RetrievalAgent', level: 'INFO', msg: 'ChromaDB query top-1 chunk match cosine_similarity=0.984' },
    { time: '14:02:15.102', agent: 'ExecutionAgent', level: 'WARN', msg: 'Command [systemctl restart postgresql] requires SRE approval' },
    { time: '14:04:12.001', agent: 'DecisionAgent', level: 'INFO', msg: 'Human approval granted by Alex Mercer (alex@enterprise.com)' },
    { time: '14:04:14.215', agent: 'ExecutionAgent', level: 'SUCCESS', msg: 'Command executed cleanly (exit status 0). Postgres active.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Live Multi-Agent System Logs"
            description="Real-time log stream from Planner, Retrieval, Execution, and Decision agents."
          />

          <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-950 font-mono text-xs space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2 font-bold">
                <Terminal className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <span>Multi-Agent Event Console Stream</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">LIVE (50ms interval)</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((l, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-slate-400 font-medium">{l.time}</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">[{l.agent}]</span>
                  <span className={l.level === 'WARN' ? 'text-amber-600 dark:text-amber-400 font-medium' : l.level === 'SUCCESS' ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-700 dark:text-slate-300 font-medium'}>
                    [{l.level}] {l.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
