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
import { Avatar } from '@/components/ui/Avatar';
import { useSidebarStore } from '@/hooks/useSidebar';
import { useIAMStore } from '@/store/iam-store';
import { useCollaborationStore } from '@/store/collaboration-store';
import { User, Mail, Building, MapPin, Globe, Shield, Save, CheckCircle2 } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { isCollapsed } = useSidebarStore();
  const { users } = useIAMStore();
  const { addToast } = useCollaborationStore();

  const currentUser = users[0];
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [designation, setDesignation] = useState(currentUser.designation);
  const [location, setLocation] = useState(currentUser.location);
  const [timezone, setTimezone] = useState(currentUser.timezone);
  const [bio, setBio] = useState(currentUser.bio || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'Profile Updated',
      desc: 'Your IAM profile credentials and timezone preferences have been saved.',
      variant: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="IAM Identity & User Profile Settings"
            description="Manage corporate employee information, technical skills, timezone, and SSO identity attributes."
          />

          {/* Profile Header Summary */}
          <Card className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <Avatar name={name} size="lg" />
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{name}</h3>
                <Badge variant="purple" size="sm">{currentUser.role}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-blue-500" />
                  <span>{currentUser.department}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-cyan-500" />
                  <span>{location}</span>
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center font-mono shrink-0">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-bold">Security Score</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">{currentUser.securityScore}/100</span>
            </div>
          </Card>

          {/* Editable Profile Form */}
          <Card className="p-6">
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <h4 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                Personal Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Timezone Preference</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none font-medium"
                >
                  <option value="PST (UTC-8)">PST (UTC-8) - San Francisco</option>
                  <option value="CST (UTC-6)">CST (UTC-6) - Austin</option>
                  <option value="EST (UTC-5)">EST (UTC-5) - New York</option>
                  <option value="GMT (UTC+0)">GMT (UTC+0) - London</option>
                  <option value="CET (UTC+1)">CET (UTC+1) - Berlin</option>
                  <option value="IST (UTC+5:30)">IST (UTC+5:30) - India</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">SRE Professional Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none resize-none font-medium"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="glow" size="lg" leftIcon={<Save className="h-4 w-4" />}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
