'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { useSidebarStore } from '@/hooks/useSidebar';
import { BookOpen } from 'lucide-react';

export default function RunbooksAnalyticsPage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Runbook Usage & Vector Indexing Analytics"
            description="Most matched operational manuals, chunk count distributions, and file format metrics."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-6 space-y-2 text-center">
              <BookOpen className="h-8 w-8 text-blue-400 mx-auto" />
              <h3 className="text-3xl font-extrabold text-white">42 Active</h3>
              <p className="text-xs text-slate-400">Indexed Runbooks in ChromaDB</p>
            </Card>

            <Card className="p-6 space-y-2 text-center">
              <h3 className="text-3xl font-extrabold text-emerald-400">PostgreSQL HA</h3>
              <p className="text-xs text-slate-400">Most Invoked SOP Manual</p>
            </Card>

            <Card className="p-6 space-y-2 text-center">
              <h3 className="text-3xl font-extrabold text-cyan-400">548 Chunks</h3>
              <p className="text-xs text-slate-400">Total Vector Embeddings</p>
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
