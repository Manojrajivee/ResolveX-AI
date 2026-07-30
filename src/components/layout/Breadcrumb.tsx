'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const SEGMENT_NAMES: Record<string, string> = {
  dashboard: 'Dashboard',
  runbooks: 'Runbook Vault',
  upload: 'Upload New',
  chat: 'AI Copilot',
  history: 'History',
  execution: 'Execution Shell',
  reports: 'Incident Reports',
  templates: 'Templates',
  analytics: 'SRE Analytics',
  incidents: 'Incidents',
  'system-health': 'System Health',
  'ai-performance': 'AI Performance',
  operations: 'AI Operations',
  agents: 'Agent Fleet',
  services: 'Services',
  logs: 'System Logs',
  queues: 'Task Queues',
  admin: 'Admin Control',
  users: 'Users',
  roles: 'Roles & Access',
  permissions: 'Permissions',
  organization: 'Organization',
  notifications: 'Notifications',
  settings: 'Settings',
  profile: 'Profile',
  security: 'Security',
  sessions: 'Active Sessions',
  help: 'Help Center',
  docs: 'Documentation',
  tutorials: 'Tutorials',
  contact: 'Support Contact',
  'system-status': 'System Status',
  'release-notes': 'Release Notes',
  faq: 'FAQ',
};

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-4 overflow-x-auto py-1 scrollbar-none"
    >
      <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 font-medium">
        <Home className="h-3.5 w-3.5 text-slate-400" />
        <span>Home</span>
      </Link>
      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const formatted = SEGMENT_NAMES[segment] || segment.replace(/-/g, ' ');

        return (
          <React.Fragment key={url}>
            <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" />
            {isLast ? (
              <span className="font-bold text-blue-600 dark:text-blue-400 capitalize shrink-0">{formatted}</span>
            ) : (
              <Link href={url} className="hover:text-slate-900 dark:hover:text-white capitalize transition-colors font-medium shrink-0">
                {formatted}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </motion.nav>
  );
};
