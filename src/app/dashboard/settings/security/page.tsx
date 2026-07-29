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
import { Shield, Key } from 'lucide-react';

export default function SettingsSecurityPage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Account Security & Authentication"
            description="Manage authentication credentials, password requirements, and active JWT sessions."
          />

          <Card className="p-6 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span>Password & Authentication Security</span>
            </h3>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <Button variant="primary" size="md" leftIcon={<Key className="h-4 w-4" />}>
                Update Security Password
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
