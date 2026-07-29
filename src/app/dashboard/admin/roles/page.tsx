'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Key, Shield } from 'lucide-react';

export default function AdminRolesPage() {
  const { isCollapsed } = useSidebarStore();
  const roles = [
    { name: 'System Administrator', code: 'ADMIN', members: 4, desc: 'Full root access to global runbooks, user accounts, and MCP tool permissions.' },
    { name: 'SRE DevOps Engineer', code: 'ENGINEER', members: 10, desc: 'Can upload runbooks, execute workflows, approve risky commands, and export reports.' },
    { name: 'Read-Only Viewer', code: 'VIEWER', members: 2, desc: 'Can inspect dashboard analytics and view incident execution history.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="System Roles & Access Levels"
            description="Configure Role-Based Access Control (RBAC) rules for enterprise engineers."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((r, idx) => (
              <Card key={idx} hoverEffect className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={r.code === 'ADMIN' ? 'purple' : 'info'} size="md">{r.code}</Badge>
                  <span className="text-xs text-slate-400 font-mono">{r.members} Members</span>
                </div>
                <h4 className="font-bold text-white text-lg">{r.name}</h4>
                <p className="text-xs text-slate-400">{r.desc}</p>
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
