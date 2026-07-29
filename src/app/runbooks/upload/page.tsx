'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { UploadForm } from '@/components/forms/UploadForm';
import { useSidebarStore } from '@/hooks/useSidebar';

export default function UploadRunbookPage() {
  const { isCollapsed } = useSidebarStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-3xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Upload Operational Runbook"
            description="Ingest PDF, Markdown (.md), or Plain Text (.txt) SOPs into ChromaDB vector store."
          />

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-2xl shadow-2xl space-y-4">
            <UploadForm onSuccess={() => router.push('/runbooks')} />
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
