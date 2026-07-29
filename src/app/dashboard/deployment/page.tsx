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
import { Cloud, Server, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function DeploymentDashboardPage() {
  const { isCollapsed } = useSidebarStore();

  const environments = [
    { name: 'Production Cluster (AWS us-east-1)', status: 'HEALTHY', version: 'v1.4.0', nodes: 12, uptime: '99.99%' },
    { name: 'Staging MCP Environment (AWS us-west-2)', status: 'HEALTHY', version: 'v1.4.1-rc1', nodes: 4, uptime: '99.95%' },
    { name: 'Development Microservices', status: 'HEALTHY', version: 'v1.5.0-dev', nodes: 2, uptime: '100%' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Deployment & Multi-Cloud Infrastructure"
            description="Manage production deployment clusters, MCP safe sandbox worker nodes, and release pipelines."
            action={
              <Button variant="glow" size="md" leftIcon={<RefreshCw className="h-4 w-4" />}>
                Trigger Deployment Pipeline
              </Button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {environments.map((env, idx) => (
              <Card key={idx} hoverEffect className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-cyan-400" />
                    <Badge variant="purple" size="sm">{env.version}</Badge>
                  </div>
                  <Badge variant="success" size="sm">{env.status}</Badge>
                </div>

                <h4 className="font-bold text-white text-base leading-snug">{env.name}</h4>

                <div className="pt-2 border-t border-slate-800 space-y-1 font-mono text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Worker Nodes:</span>
                    <span className="text-white">{env.nodes} Nodes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SLA Uptime:</span>
                    <span className="text-emerald-400">{env.uptime}</span>
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
