'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Check, X } from 'lucide-react';

export default function AdminPermissionsMatrixPage() {
  const { isCollapsed } = useSidebarStore();
  const matrix = [
    { module: 'Runbook Upload & Ingestion', admin: true, engineer: true, viewer: false },
    { module: 'Safe Command Execution', admin: true, engineer: true, viewer: false },
    { module: 'Authorize Risky Commands', admin: true, engineer: true, viewer: false },
    { module: 'User Account Management', admin: true, engineer: false, viewer: false },
    { module: 'View Incident Reports', admin: true, engineer: true, viewer: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Permission Access Matrix"
            description="Granular permission mapping across system modules."
          />

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">System Module Capability</th>
                  <th className="py-3.5 px-4 text-center">Administrator</th>
                  <th className="py-3.5 px-4 text-center">SRE Engineer</th>
                  <th className="py-3.5 px-4 text-center">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {matrix.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-semibold text-white">{m.module}</td>
                    <td className="py-3.5 px-4 text-center">{m.admin ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-slate-600 mx-auto" />}</td>
                    <td className="py-3.5 px-4 text-center">{m.engineer ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-slate-600 mx-auto" />}</td>
                    <td className="py-3.5 px-4 text-center">{m.viewer ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-slate-600 mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
