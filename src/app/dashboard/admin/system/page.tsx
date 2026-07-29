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
import { Server, Cpu, Database, ShieldCheck } from 'lucide-react';

export default function AdminSystemPage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="System Environment & AI Config"
            description="Inspect backend API environment, vector database indexes, and MCP shell wrapper specs."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-400" />
                <span>Spring Boot Backend (Java 21)</span>
              </h4>
              <div className="font-mono text-xs space-y-1 text-slate-300">
                <div>Environment: Production Enterprise</div>
                <div>Port: 8080 | Status: <span className="text-emerald-400">UP</span></div>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <Cpu className="h-5 w-5 text-cyan-400" />
                <span>ChromaDB Vector Store</span>
              </h4>
              <div className="font-mono text-xs space-y-1 text-slate-300">
                <div>Embedding Model: text-embedding-3-small</div>
                <div>Total Indexed Collections: 42 Runbooks</div>
              </div>
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
