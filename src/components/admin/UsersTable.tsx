'use client';

import React from 'react';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { UserX, Key } from 'lucide-react';

export const UsersTable: React.FC = () => {
  const users = [
    { id: 'usr-1', name: 'Alex Mercer', email: 'alex.mercer@enterprise.com', role: 'ADMIN', status: 'ACTIVE', department: 'Site Reliability Engineering', lastActive: 'Now' },
    { id: 'usr-2', name: 'Sarah Connor', email: 'sarah.connor@enterprise.com', role: 'ENGINEER', status: 'ACTIVE', department: 'DevOps & Cloud Operations', lastActive: '10m ago' },
    { id: 'usr-3', name: 'David Miller', email: 'david.miller@enterprise.com', role: 'ENGINEER', status: 'ACTIVE', department: 'Infrastructure Core', lastActive: '1h ago' },
    { id: 'usr-4', name: 'Elena Rostova', email: 'elena.rostova@enterprise.com', role: 'VIEWER', status: 'INACTIVE', department: 'Security Audit', lastActive: '3d ago' },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs">
      <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
        <thead className="bg-slate-100/80 dark:bg-slate-950/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
          <tr>
            <th className="py-3.5 px-4">User</th>
            <th className="py-3.5 px-4">Role</th>
            <th className="py-3.5 px-4">Department</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Last Active</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-medium">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} size="sm" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{u.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <Badge variant={u.role === 'ADMIN' ? 'purple' : 'info'} size="sm">
                  {u.role}
                </Badge>
              </td>
              <td className="py-3.5 px-4 text-slate-800 dark:text-slate-300">{u.department}</td>
              <td className="py-3.5 px-4">
                <Badge variant={u.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
                  {u.status}
                </Badge>
              </td>
              <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">{u.lastActive}</td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" title="Edit Permissions">
                    <Key className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-rose-600 dark:text-rose-400" title="Revoke Access">
                    <UserX className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
