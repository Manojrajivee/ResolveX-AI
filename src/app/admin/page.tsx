'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { UsersTable } from '@/components/admin/UsersTable';
import { Card } from '@/components/ui/Card';
import { useSidebarStore } from '@/hooks/useSidebar';
import { ShieldAlert, Users, Key, FileCheck } from 'lucide-react';

export default function AdminPage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Admin Control & System Security Panel"
            description="Manage system users, assign SRE roles, audit global runbook policies, and monitor MCP tools."
          />

          {/* Admin Stat Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Total Registered Users</p>
                <h3 className="text-2xl font-extrabold text-white">14 SRE Engineers</h3>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Key className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Active Roles</p>
                <h3 className="text-2xl font-extrabold text-white">4 Admins / 10 Engineers</h3>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Global Runbook Policies</p>
                <h3 className="text-2xl font-extrabold text-white">42 Validated</h3>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Security Intercepts</p>
                <h3 className="text-2xl font-extrabold text-white">100% Guard Compliance</h3>
              </div>
            </Card>
          </div>

          {/* User Management Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">User Accounts & Role Permissions</h3>
            <UsersTable />
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
