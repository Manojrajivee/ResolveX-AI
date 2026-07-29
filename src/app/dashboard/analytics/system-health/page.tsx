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
import { Server, Database, Cpu, ShieldCheck } from 'lucide-react';

export default function SystemHealthAnalyticsPage() {
  const { isCollapsed } = useSidebarStore();

  const services = [
    { name: 'Spring Boot REST API Gateway', status: 'HEALTHY', latency: '12ms', icon: Server },
    { name: 'MongoDB Incident Log Database', status: 'HEALTHY', latency: '4ms', icon: Database },
    { name: 'ChromaDB Vector Embedding Store', status: 'HEALTHY', latency: '18ms', icon: Cpu },
    { name: 'MCP Safe Shell Wrapper Sandbox', status: 'HEALTHY', latency: '2ms', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="System Health & Infrastructure Monitoring"
            description="Real-time status metrics for API gateways, databases, vector stores, and MCP execution sandboxes."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <Card key={idx} hoverEffect className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{srv.name}</h4>
                      <span className="text-xs text-slate-400 font-mono">Response Latency: {srv.latency}</span>
                    </div>
                  </div>

                  <Badge variant="success" size="md">{srv.status}</Badge>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
