'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { LiveTimeline } from '@/components/timeline/LiveTimeline';
import { useSidebarStore } from '@/hooks/useSidebar';

export default function ExecutionDetailPage() {
  const { isCollapsed } = useSidebarStore();
  const params = useParams();
  const incidentId = params?.incidentId as string || 'INC-2026-8941';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title={`Execution - ${incidentId}`}
            description="Live MCP terminal command stream and automated step runner."
          />

          <LiveTimeline />
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
