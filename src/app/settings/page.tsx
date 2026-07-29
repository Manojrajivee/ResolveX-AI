'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Camera, Sun, Moon, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { isCollapsed } = useSidebarStore();
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="User & System Settings"
            description="Manage engineer credentials, security preferences, theme tokens, and notifications."
          />

          <Tabs
            tabs={[
              { id: 'profile', label: 'User Profile' },
              { id: 'security', label: 'Security & Auth' },
              { id: 'appearance', label: 'Theme & Appearance' },
              { id: 'preferences', label: 'SRE Preferences' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'profile' && (
            <Card className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="relative group">
                  <Avatar name={user?.name || 'Alex Mercer'} src={user?.avatarUrl} size="lg" />
                  <div className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name || 'Alex Mercer'}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user?.email || 'alex.mercer@enterprise.io'}</p>
                </div>
              </div>

              <ProfileForm />
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Visual Interface Theme</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred visual presentation mode.</p>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="h-5 w-5 text-blue-500" /> : <Sun className="h-5 w-5 text-amber-500" />}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Current Theme: {theme.toUpperCase()}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Optimized for high-contrast enterprise operations.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={toggleTheme}>
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Password & Security</h3>
              <div className="space-y-3">
                <Button variant="outline" size="md" leftIcon={<Shield className="h-4 w-4" />}>
                  Change Security Password
                </Button>
                <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">
                  JWT Session Expiry: 24 Hours | BCrypt Encryption Active
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification & Risk Guard Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-semibold cursor-pointer">
                  <span>Require explicit human confirmation for RISKY commands</span>
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-blue-600 h-4 w-4" />
                </label>
              </div>
            </Card>
          )}
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
