'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Cpu, HardDrive, Server, Zap } from 'lucide-react';

export default function OperationsSystemPage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="System Resources & Node Metrics"
            description="CPU load averages, RAM allocations, disk I/O, and network bandwidth monitoring."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 space-y-3">
              <Cpu className="h-6 w-6 text-blue-400" />
              <h3 className="text-2xl font-extrabold text-white">46% Load</h3>
              <p className="text-xs text-slate-400">8 Core CPU Cluster</p>
            </Card>

            <Card className="p-6 space-y-3">
              <Server className="h-6 w-6 text-purple-400" />
              <h3 className="text-2xl font-extrabold text-white">18.4 GB</h3>
              <p className="text-xs text-slate-400">32 GB RAM In-Use</p>
            </Card>

            <Card className="p-6 space-y-3">
              <HardDrive className="h-6 w-6 text-emerald-400" />
              <h3 className="text-2xl font-extrabold text-white">142 GB Available</h3>
              <p className="text-xs text-slate-400">500 GB NVMe Storage</p>
            </Card>

            <Card className="p-6 space-y-3">
              <Zap className="h-6 w-6 text-amber-400" />
              <h3 className="text-2xl font-extrabold text-white">1.2 Gbps</h3>
              <p className="text-xs text-slate-400">Network Throughput</p>
            </Card>
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
