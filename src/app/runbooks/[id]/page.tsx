'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_RUNBOOKS } from '@/store/runbook-store';
import { useSidebarStore } from '@/hooks/useSidebar';
import { FileText, Clock, User, Download, Play, History, Tag } from 'lucide-react';
import Link from 'next/link';

export default function RunbookDetailPage() {
  const { isCollapsed } = useSidebarStore();
  const params = useParams();
  const id = params?.id as string;

  const runbook = MOCK_RUNBOOKS.find((r) => r.id === id) || MOCK_RUNBOOKS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title={runbook.title}
            description={runbook.description}
            action={
              <div className="flex items-center gap-3">
                <Link href="/chat">
                  <Button variant="glow" size="md" leftIcon={<Play className="h-4 w-4" />}>
                    Trigger Incident Session
                  </Button>
                </Link>
                <Button variant="outline" size="md" leftIcon={<Download className="h-4 w-4" />}>
                  Download Document
                </Button>
              </div>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Runbook Extracted Steps & Preview (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-4">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span>Parsed Extracted Steps ({runbook.steps.length})</span>
                </h3>

                <div className="space-y-3">
                  {runbook.steps.map((step) => (
                    <div key={step.stepNumber} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-400 text-sm">
                          Step {step.stepNumber}: {step.title}
                        </span>
                        <Badge variant={step.riskLevel === 'SAFE' ? 'info' : 'warning'} size="sm">
                          {step.riskLevel}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300">{step.description}</p>
                      {step.command && (
                        <div className="font-mono text-xs text-emerald-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          $ {step.command}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Metadata & Version History Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-4">
                <h3 className="font-bold text-white text-sm pb-2 border-b border-slate-800">Runbook Metadata</h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Format:</span>
                    <Badge variant="purple" size="sm">{runbook.format}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Size:</span>
                    <span className="font-mono text-slate-200">{runbook.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vector Chunks:</span>
                    <span className="font-mono text-cyan-400">{runbook.chunksCount} chunks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uploaded By:</span>
                    <span className="text-slate-200 font-semibold">{runbook.uploadedBy}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-blue-400" /> Tags:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {runbook.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Version History */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-2 border-b border-slate-800">
                  <History className="h-4 w-4 text-cyan-400" />
                  <span>Version Audit History</span>
                </h3>
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-emerald-400">
                    <span>v1.2 (Current Active)</span>
                    <span className="text-[10px] text-slate-500">Yesterday</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-400">
                    <span>v1.0 (Initial Ingestion)</span>
                    <span className="text-[10px] text-slate-500">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
