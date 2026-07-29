'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { useSidebarStore } from '@/hooks/useSidebar';

export default function AuditLogsPage() {
  const { isCollapsed } = useSidebarStore();

  const logs = [
    { id: 'LOG-1001', user: 'Alex Mercer', action: 'AUTHORIZED_COMMAND', resource: 'systemctl restart postgresql', ip: '192.168.1.45', date: 'Today, 14:04:12', status: 'SUCCESS' },
    { id: 'LOG-1002', user: 'Runbook Agent AI', action: 'EXECUTED_SAFE_COMMAND', resource: 'systemctl status postgresql', ip: '127.0.0.1', date: 'Today, 14:02:15', status: 'SUCCESS' },
    { id: 'LOG-1003', user: 'Sarah Connor', action: 'INGESTED_RUNBOOK', resource: 'k8s-oom-recovery.pdf', ip: '192.168.1.88', date: 'Yesterday, 09:15:00', status: 'SUCCESS' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Security Audit Logs"
            description="Immutable audit trail of user logins, role authorizations, and MCP tool command invocations."
          />

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Log ID</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Resource / Command</th>
                  <th className="py-3.5 px-4">IP Address</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 text-cyan-400 font-bold">{l.id}</td>
                    <td className="py-3.5 px-4 text-white font-sans font-semibold">{l.user}</td>
                    <td className="py-3.5 px-4 text-purple-400">{l.action}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans">{l.resource}</td>
                    <td className="py-3.5 px-4 text-slate-400">{l.ip}</td>
                    <td className="py-3.5 px-4 text-slate-400">{l.date}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge variant="success" size="sm">{l.status}</Badge>
                    </td>
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
