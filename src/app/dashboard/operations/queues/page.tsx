'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Layers } from 'lucide-react';

export default function OperationsQueuesPage() {
  const { isCollapsed } = useSidebarStore();

  const queues = [
    { name: 'Command Execution Queue', waiting: 0, running: 1, completed: 890, failed: 2 },
    { name: 'Runbook Vector Embedding Ingestion Queue', waiting: 0, running: 0, completed: 42, failed: 0 },
    { name: 'PDF Incident Report Generation Queue', waiting: 1, running: 0, completed: 210, failed: 1 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Async Execution & Ingestion Queues"
            description="Background worker queue depths, active threads, and completed execution jobs."
          />

          <div className="space-y-4">
            {queues.map((q, idx) => (
              <Card key={idx} hoverEffect className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{q.name}</h4>
                    <span className="text-xs text-slate-400 font-mono">Running: {q.running} • Waiting: {q.waiting}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Completed</span>
                    <span className="text-emerald-400 font-bold">{q.completed}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Failed</span>
                    <span className="text-rose-400 font-bold">{q.failed}</span>
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
