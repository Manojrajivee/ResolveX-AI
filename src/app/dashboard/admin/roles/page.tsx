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
import { Modal } from '@/components/ui/Modal';
import { useSidebarStore } from '@/hooks/useSidebar';
import { useIAMStore, IAMRole } from '@/store/iam-store';
import { Shield, Plus, Copy, Edit, Trash2, Users, CheckCircle2 } from 'lucide-react';

export default function RolesAdminPage() {
  const { isCollapsed } = useSidebarStore();
  const { roles } = useIAMStore();
  const [selectedRole, setSelectedRole] = useState<IAMRole | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Enterprise Role-Based Access Control (RBAC)"
            description="Configure role definitions, assign permission scopes, and manage system access levels."
            action={
              <Button variant="glow" size="sm" onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
                Create Custom Role
              </Button>
            }
          />

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id} hoverEffect className="p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <Shield className="h-5 w-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{role.name}</h4>
                    </div>
                    {role.isSystem && <Badge variant="purple" size="sm">System Built-In</Badge>}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{role.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>{role.usersCount} Enrolled Users</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{role.permissionsCount} Perms</span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedRole(role)} leftIcon={<Edit className="h-3.5 w-3.5" />}>
                    Configure Matrix
                  </Button>
                  <Button variant="ghost" size="sm" title="Clone Role">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Role Details Modal */}
      <Modal isOpen={!!selectedRole} onClose={() => setSelectedRole(null)} title={`Role Configuration: ${selectedRole?.name}`}>
        {selectedRole && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-400 font-medium">{selectedRole.description}</p>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-white">Active Module Grants</h5>
              <div className="grid grid-cols-2 gap-2 font-mono">
                {['Runbook Management (Read/Write/Exec)', 'Incident Resolution (Full)', 'AI Agent Overrides (Authorized)', 'Audit Logs Inspection (Read)', 'System Config (Manage)', 'PDF Report Export (Granted)'].map((grant, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{grant}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Role Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Custom IAM Role">
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role Title</label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g. Lead Incident Engineer"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Scope Description</label>
            <textarea
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
              placeholder="Describe access boundary..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none resize-none"
            />
          </div>

          <Button variant="glow" size="lg" className="w-full mt-2" onClick={() => setIsCreateOpen(false)}>
            Save & Publish Custom Role
          </Button>
        </div>
      </Modal>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
