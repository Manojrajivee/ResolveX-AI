'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PDFViewer } from '@/components/reports/PDFViewer';
import { MOCK_REPORTS } from '@/services/report.service';
import { useSidebarStore } from '@/hooks/useSidebar';

export default function ReportDetailPage() {
  const { isCollapsed } = useSidebarStore();
  const params = useParams();
  const id = params?.id as string;
  const report = MOCK_REPORTS.find((r) => r.id === id || r.incidentId === id) || MOCK_REPORTS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title={`Report - ${report.incidentId}`}
            description={report.title}
          />

          <PDFViewer report={report} />
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
