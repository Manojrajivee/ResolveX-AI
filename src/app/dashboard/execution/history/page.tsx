'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Activity, Clock, Play } from 'lucide-react';
import Link from 'next/link';

export default function ExecutionHistoryPage() {
  const { isCollapsed } = useSidebarStore();
  const history = [
    { id: 'INC-2026-8941', runbook: 'PostgreSQL HA Recovery', status: 'RESOLVED', steps: 4, duration: '2m 14s', date: 'Today, 14:02' },
    { id: 'INC-2026-8920', runbook: 'Nginx SSL Cert Renewal', status: 'RESOLVED', steps: 3, duration: '1m 05s', date: 'Yesterday, 09:12' },
    { id: 'INC-2026-8894', runbook: 'K8s OOMKilled Pod Scale', status: 'RESOLVED', steps: 5, duration: '4m 30s', date: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Command Execution History"
            description="Audit trail of past SRE shell executions, outputs, and authorization events."
          />

          <div className="space-y-3">
            {history.map((h) => (
              <Card key={h.id} hoverEffect className="flex items-center justify-between p-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{h.runbook}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">Incident ID: {h.id} • {h.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-400">{h.steps} Steps ({h.duration})</span>
                  <Badge variant="success" size="sm">{h.status}</Badge>
                  <Link href={`/dashboard/execution/${h.id}`}>
                    <Button variant="outline" size="sm" leftIcon={<Play className="h-3 w-3" />}>
                      Inspect Logs
                    </Button>
                  </Link>
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
