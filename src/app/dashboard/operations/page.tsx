'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_AGENTS } from '@/services/operations.service';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Cpu } from 'lucide-react';
import Link from 'next/link';

export default function OperationsDashboardPage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="AI Agent Operations & Infrastructure Monitoring"
            description="Live status tracking for Multi-Agent systems (Planner, Retrieval, Execution, Decision, Reporter)."
          />

          {/* SRE Agent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_AGENTS.map((agent) => (
              <Card key={agent.id} hoverEffect className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{agent.name}</h4>
                  </div>
                  <Badge variant={agent.status === 'HEALTHY' ? 'success' : 'warning'} size="sm">
                    {agent.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{agent.role}</p>

                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5 font-mono text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Latency:</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">{agent.responseTimeMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Success Rate:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{agent.successRatePct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Requests:</span>
                    <span className="text-slate-900 dark:text-white font-bold">{agent.requestsProcessed}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Sub-navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <Link href="/dashboard/operations/agents" className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-500/50 shadow-2xs">
              🤖 Agents
            </Link>
            <Link href="/dashboard/operations/services" className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-500/50 shadow-2xs">
              ⚡ Services
            </Link>
            <Link href="/dashboard/operations/system" className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-500/50 shadow-2xs">
              🖥️ System Resources
            </Link>
            <Link href="/dashboard/operations/queues" className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-500/50 shadow-2xs">
              📊 Queues
            </Link>
            <Link href="/dashboard/operations/logs" className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-500/50 shadow-2xs">
              📜 Live Logs
            </Link>
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
