'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ReportCards } from '@/components/reports/ReportCards';
import { PDFViewer } from '@/components/reports/PDFViewer';
import { SearchForm } from '@/components/forms/SearchForm';
import { Modal } from '@/components/ui/Modal';
import { MOCK_REPORTS } from '@/services/report.service';
import { useSidebarStore } from '@/hooks/useSidebar';
import { IncidentReport } from '@/types/report';

export default function ReportsPage() {
  const { isCollapsed } = useSidebarStore();
  const [reports] = useState<IncidentReport[]>(MOCK_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.incidentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Incident Resolution PDF Reports"
            description="Download, audit, and inspect automatically generated PDF reports for resolved incidents."
          />

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl shadow-xs">
            <SearchForm placeholder="Search reports by ID, issue title, or severity..." onSearch={setSearchQuery} className="max-w-md" />
          </div>

          <ReportCards reports={filtered} onSelectReport={(rep) => setSelectedReport(rep)} />
        </div>
      </main>

      {/* PDF Detail Modal */}
      <Modal isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} title="Incident Report Document View">
        {selectedReport && <PDFViewer report={selectedReport} />}
      </Modal>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
