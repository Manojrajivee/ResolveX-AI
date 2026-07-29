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

export default function OperationsAgentsPage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="AI Agents Status & Active Tasks"
            description="Deep inspection into Planner, Retrieval, Execution, Decision, and Reporter agent states."
          />

          <div className="space-y-4">
            {MOCK_AGENTS.map((agent) => (
              <Card key={agent.id} hoverEffect className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{agent.name}</h4>
                      <Badge variant={agent.status === 'HEALTHY' ? 'success' : 'warning'} size="sm">{agent.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{agent.role}</p>
                    {agent.currentTask && (
                      <span className="text-[11px] font-mono text-cyan-400 mt-1 block">$ Task: {agent.currentTask}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Response</span>
                    <span className="text-cyan-400 font-bold">{agent.responseTimeMs} ms</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Requests</span>
                    <span className="text-white font-bold">{agent.requestsProcessed}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Success</span>
                    <span className="text-emerald-400 font-bold">{agent.successRatePct}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
