'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useSidebarStore } from '@/hooks/useSidebar';
import { useIAMStore } from '@/store/iam-store';
import { Search, Download, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';

export default function AuditLogsPage() {
  const { isCollapsed } = useSidebarStore();
  const { auditLogs } = useIAMStore();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(
    (l) => l.actor.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="IAM & System Audit Log Timeline"
            description="Immutable compliance audit trail tracking identity events, risk approvals, and system state transitions."
            action={
              <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
                Export Audit CSV
              </Button>
            }
          />

          {/* Search Toolbar */}
          <Card className="p-4 flex items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search actor, action, target, IP address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </Card>

          {/* Audit Timeline Stream */}
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <Card key={log.id} className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0 mt-0.5">
                    {log.status === 'WARN' ? <AlertTriangle className="h-5 w-5 text-amber-500" /> : <ShieldCheck className="h-5 w-5 text-emerald-500" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">[{log.action}]</span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{log.target}</h4>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{log.details}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                      <span>Actor: <strong className="text-slate-900 dark:text-white">{log.actor}</strong></span>
                      <span>•</span>
                      <span>IP: {log.ip}</span>
                      <span>•</span>
                      <span>Time: {log.timestamp}</span>
                    </div>
                  </div>
                </div>

                <Badge variant={log.status === 'SUCCESS' ? 'success' : 'warning'} size="sm">
                  {log.status}
                </Badge>
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
