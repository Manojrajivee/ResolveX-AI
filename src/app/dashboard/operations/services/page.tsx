'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_SERVICES } from '@/services/operations.service';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Server } from 'lucide-react';

export default function OperationsServicesPage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Backend Integration Services Health"
            description="Monitoring status for Spring Boot REST API, MongoDB, ChromaDB, and MCP Sandbox."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_SERVICES.map((srv) => (
              <Card key={srv.id} hoverEffect className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Server className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{srv.name}</h4>
                    <span className="text-xs text-slate-400 font-mono">Uptime: {srv.uptimePct}% • Latency: {srv.latencyMs}ms</span>
                  </div>
                </div>

                <Badge variant="success" size="md">{srv.status}</Badge>
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
