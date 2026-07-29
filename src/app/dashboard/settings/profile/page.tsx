'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { useSidebarStore } from '@/hooks/useSidebar';

export default function SettingsProfilePage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="User Profile Management"
            description="Update personal details, work email, and engineering team metadata."
          />

          <Card className="p-6 space-y-6">
            <ProfileForm />
          </Card>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
