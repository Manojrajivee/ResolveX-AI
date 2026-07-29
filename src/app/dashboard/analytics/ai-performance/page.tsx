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
import { Cpu, Brain, Zap } from 'lucide-react';

export default function AIPerformanceAnalyticsPage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="AI Multi-Agent Performance & Token Analytics"
            description="LangGraph agent reasoning scores, ChromaDB vector top-1 chunk match rates, and LLM latency."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-6 space-y-2 text-center">
              <Cpu className="h-8 w-8 text-cyan-400 mx-auto" />
              <h3 className="text-3xl font-extrabold text-white">97.8%</h3>
              <p className="text-xs text-slate-400">ChromaDB Top-1 Chunk Match Accuracy</p>
            </Card>

            <Card className="p-6 space-y-2 text-center">
              <Brain className="h-8 w-8 text-purple-400 mx-auto" />
              <h3 className="text-3xl font-extrabold text-white">1.4s</h3>
              <p className="text-xs text-slate-400">Average Agent Reasoning Latency</p>
            </Card>

            <Card className="p-6 space-y-2 text-center">
              <Zap className="h-8 w-8 text-emerald-400 mx-auto" />
              <h3 className="text-3xl font-extrabold text-white">100%</h3>
              <p className="text-xs text-slate-400">MCP Risk Guardrail Compliance</p>
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
