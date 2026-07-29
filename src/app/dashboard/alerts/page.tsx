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
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export default function AlertsDashboardPage() {
  const { isCollapsed } = useSidebarStore();

  const alerts = [
    { id: 'ALT-901', title: 'High Memory Threshold Exceeded (95%)', source: 'Redis Cluster Node-04', severity: 'CRITICAL', time: '10m ago' },
    { id: 'ALT-902', title: 'HTTP 502 Bad Gateway Spike', source: 'Nginx Ingress Controller', severity: 'HIGH', time: '45m ago' },
    { id: 'ALT-903', title: 'PostgreSQL Primary Node Unresponsive', source: 'db-cluster-prod-02', severity: 'CRITICAL', time: '2h ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="System & Security Alerts Dashboard"
            description="Real-time monitoring of infrastructure alerts triggering AI Runbook execution workflows."
          />

          <div className="space-y-4">
            {alerts.map((alt) => (
              <Card key={alt.id} hoverEffect className="p-5 flex items-center justify-between border-amber-500/30 bg-amber-950/10">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{alt.title}</h4>
                      <Badge variant="danger" size="sm">{alt.severity}</Badge>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Source: {alt.source} • {alt.time}</span>
                  </div>
                </div>

                <Badge variant="warning" size="md">Workflow Triggered</Badge>
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
