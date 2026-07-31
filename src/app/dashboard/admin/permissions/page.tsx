'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSidebarStore } from '@/hooks/useSidebar';
import { useIAMStore } from '@/store/iam-store';
import { Save, CheckSquare } from 'lucide-react';

export default function PermissionsAdminPage() {
  const { isCollapsed } = useSidebarStore();
  const { permissions, updatePermissions } = useIAMStore();

  const handleToggle = (moduleKey: keyof typeof permissions, permKey: string) => {
    const updated = {
      ...permissions,
      [moduleKey]: {
        ...(permissions[moduleKey] as any),
        [permKey]: !(permissions[moduleKey] as any)[permKey],
      },
    };
    updatePermissions(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Granular RBAC Permissions Matrix"
            description="Manage fine-grained Read, Write, Execute, Approve, and Admin privileges across system modules."
            action={
              <Button variant="glow" size="sm" leftIcon={<Save className="h-4 w-4" />}>
                Save Permissions Matrix
              </Button>
            }
          />

          {/* Matrix Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xs">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100/80 dark:bg-slate-950/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-4 px-6">System Module / Domain</th>
                  <th className="py-4 px-4 text-center">Read / Inspect</th>
                  <th className="py-4 px-4 text-center">Write / Modify</th>
                  <th className="py-4 px-4 text-center">Delete / Purge</th>
                  <th className="py-4 px-4 text-center">Execute Command</th>
                  <th className="py-4 px-4 text-center">Approve High-Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-medium">
                {[
                  { key: 'runbooks', title: 'Runbook Vault & RAG Chunks', desc: 'SOP file uploads, ChromaDB embeddings, step definitions' },
                  { key: 'incidents', title: 'Incident Workspace & Graph', desc: 'Live execution timeline, incident closure, MTTR reports' },
                  { key: 'aiExecutions', title: 'AI Agent Shell & MCP Sandbox', desc: 'Python shell execution, safe command allowlist rules' },
                  { key: 'reports', title: 'PDF Executive Reports', desc: 'Incident PDF generation, historical compliance archives' },
                  { key: 'operations', title: 'Operations & Infrastructure', desc: 'Multi-Agent health telemetry, system queues, log streams' },
                  { key: 'organization', title: 'Organization & IAM Admin', desc: 'User accounts, role assignments, billing, SSO keys' },
                ].map((mod) => {
                  const modPerms = (permissions as any)[mod.key] || {};
                  return (
                    <tr key={mod.key} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{mod.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{mod.desc}</p>
                      </td>
                      {['read', 'write', 'delete', 'execute', 'approve'].map((permAction) => (
                        <td key={permAction} className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={!!modPerms[permAction]}
                            onChange={() => handleToggle(mod.key as any, permAction)}
                            className="h-4 w-4 rounded border-slate-300 dark:border-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
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
