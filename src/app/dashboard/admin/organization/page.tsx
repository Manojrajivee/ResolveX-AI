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
import { Building, Save } from 'lucide-react';

export default function AdminOrganizationPage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Organization & SRE Policy Settings"
            description="Manage corporate entity details, security boundaries, and SLA thresholds."
          />

          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-400" />
              <span>Enterprise Organization Identity</span>
            </h3>

            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                <input type="text" defaultValue="Enterprise Cloud Operations Inc." className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Support Contact Email</label>
                <input type="email" defaultValue="sre-support@enterprise.com" className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white focus:outline-none" />
              </div>
              <Button variant="primary" size="md" leftIcon={<Save className="h-4 w-4" />}>
                Save Organization Settings
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
