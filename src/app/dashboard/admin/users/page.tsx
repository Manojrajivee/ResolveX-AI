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
import { Modal } from '@/components/ui/Modal';
import { useSidebarStore } from '@/hooks/useSidebar';
import { useIAMStore, IAMUser } from '@/store/iam-store';
import { Search, UserPlus, Shield, Filter, MoreHorizontal, UserX, CheckCircle, Key, RefreshCw } from 'lucide-react';

export default function UsersAdminPage() {
  const { isCollapsed } = useSidebarStore();
  const { users, addUser, updateUserStatus, deleteUser } = useIAMStore();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<IAMUser | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('DevOps Engineer');

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesDept = deptFilter === 'ALL' || u.department === deptFilter;
    return matchesSearch && matchesRole && matchesDept;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    addUser({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
    });
    setInviteName('');
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Enterprise Identity & User Directory"
            description="Manage corporate user accounts, SSO identity profiles, roles, and security scores."
            action={
              <Button variant="glow" size="sm" onClick={() => setIsInviteOpen(true)} leftIcon={<UserPlus className="h-4 w-4" />}>
                Invite User
              </Button>
            }
          />

          {/* Search & Filter Toolbar */}
          <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, employee ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="font-bold text-slate-500">Filters:</span>
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Operations Manager">Operations Manager</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Auditor">Auditor</option>
              </select>
            </div>
          </Card>

          {/* IAM Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xs">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100/80 dark:bg-slate-950/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">User Identity</th>
                  <th className="py-3.5 px-4">IAM Role</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Security Score</th>
                  <th className="py-3.5 px-4">Last Active</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white">{u.name}</h4>
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                              {u.employeeId}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.role.includes('Admin') ? 'purple' : u.role.includes('Manager') ? 'info' : 'neutral'} size="sm">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 dark:text-slate-300 font-semibold">{u.department}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.status === 'ACTIVE' ? 'success' : 'warning'} size="sm">
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-mono font-bold ${u.securityScore >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {u.securityScore}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">{u.lastActive}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(u)} title="Inspect Identity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateUserStatus(u.id, u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                          title={u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        >
                          <CheckCircle className={`h-4 w-4 ${u.status === 'ACTIVE' ? 'text-emerald-500' : 'text-slate-400'}`} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteUser(u.id)} className="text-rose-600 dark:text-rose-400" title="Delete User">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* User Details Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="IAM Identity Details">
        {selectedUser && (
          <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <Avatar name={selectedUser.name} size="md" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{selectedUser.name}</h4>
                <p className="text-slate-500 dark:text-slate-400 font-mono text-xs">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="purple" size="sm">{selectedUser.role}</Badge>
                  <span className="text-[10px] font-mono text-slate-400">{selectedUser.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-white">Assigned Technical Skills</h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedUser.skills?.map((sk, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono text-[11px]">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
              <span>SOC-2 Identity Security Score: {selectedUser.securityScore}/100</span>
              <span>2FA: {selectedUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Invite User Modal */}
      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite User to Enterprise IAM">
        <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Jordan Vance"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Corporate Email</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="jordan@enterprise.com"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned IAM Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Operations Manager">Operations Manager</option>
              <option value="Administrator">Administrator</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>

          <Button type="submit" variant="glow" size="lg" className="w-full mt-2">
            Send Okta SSO Invitation Link
          </Button>
        </form>
      </Modal>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
