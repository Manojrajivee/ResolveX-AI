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
import { FileText, CheckCircle2 } from 'lucide-react';

export default function ReportTemplatesPage() {
  const { isCollapsed } = useSidebarStore();
  const templates = [
    { id: 't-1', title: 'Standard Incident Resolution Report', desc: 'Default template containing executive summary, step execution logs, and MTTR velocity.', active: true },
    { id: 't-2', title: 'Executive Management Brief', desc: 'High-level business impact summary without verbose terminal output logs.', active: false },
    { id: 't-3', title: 'SOC-2 Compliance Audit Report', desc: 'Includes full cryptographically signed authorization logs and user permission verification.', active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-5xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="PDF Incident Report Templates"
            description="Configure layout templates for automated post-incident PDF generation."
          />

          <div className="space-y-4">
            {templates.map((tpl) => (
              <Card key={tpl.id} hoverEffect className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{tpl.title}</h4>
                      {tpl.active && <Badge variant="success" size="sm">Active Template</Badge>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{tpl.desc}</p>
                  </div>
                </div>

                <Button variant={tpl.active ? 'secondary' : 'outline'} size="sm">
                  {tpl.active ? 'Configured' : 'Select Template'}
                </Button>
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
