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
import { Building, Users, ShieldCheck, Mail, Plus, Edit, UserPlus, Globe } from 'lucide-react';

export default function OrganizationAdminPage() {
  const { isCollapsed } = useSidebarStore();
  const { organization } = useIAMStore();

  const [teams, setTeams] = useState([
    { id: 't-1', name: 'Alpha SRE Response Team', lead: 'Alex Mercer', membersCount: 14, focus: 'Database HA & Primary Failover' },
    { id: 't-2', name: 'Cloud Infrastructure Core', lead: 'Sarah Connor', membersCount: 18, focus: 'Kubernetes Pod Auto-scaling' },
    { id: 't-3', name: 'Security & Compliance Vault', lead: 'Elena Rostova', membersCount: 10, focus: 'SOC-2 & MCP Shell Allowlist' },
  ]);

  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamFocus, setTeamFocus] = useState('');

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;
    setTeams([
      ...teams,
      { id: `t-${Date.now()}`, name: teamName, lead: 'Alex Mercer', membersCount: 1, focus: teamFocus || 'General SRE' },
    ]);
    setTeamName('');
    setTeamFocus('');
    setIsAddTeamOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Enterprise Organization & Team Structure"
            description="Manage corporate tenant settings, business units, department teams, and invitation domains."
            action={
              <Button variant="glow" size="sm" onClick={() => setIsAddTeamOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Create Engineering Team
              </Button>
            }
          />

          {/* Org Header Card */}
          <Card className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl">
                  <Building className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{organization.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-blue-500" />
                      <span>{organization.domain}</span>
                    </span>
                    <span>•</span>
                    <Badge variant="success" size="sm">{organization.plan}</Badge>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
                Edit Tenant Settings
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">{organization.membersCount}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Enrolled Members</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="text-2xl font-black text-blue-600 dark:text-blue-400">{teams.length}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Active Teams</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{organization.departments.length}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Departments</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="text-2xl font-black text-purple-600 dark:text-purple-400">100%</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">SSO Enforced</p>
              </div>
            </div>
          </Card>

          {/* Teams Grid */}
          <div className="space-y-4">
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Active Engineering Teams</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams.map((t) => (
                <Card key={t.id} hoverEffect className="p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900 dark:text-white text-base">{t.name}</h5>
                      <Badge variant="info" size="sm">{t.membersCount} Members</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{t.focus}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 dark:text-slate-400">Team Lead:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{t.lead}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
