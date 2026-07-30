import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Activity,
  FileText,
  BarChart3,
  Bell,
  Settings,
  ShieldAlert,
  Cpu,
  Cloud,
  HelpCircle,
  Palette,
  FolderOpen,
  Upload,
  History,
  Terminal,
  FileSpreadsheet,
  Gauge,
  Server,
  Users,
  Lock,
  LifeBuoy,
  Key,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export interface SubItem {
  title: string;
  href: string;
  badge?: string;
}

export interface SidebarItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  adminOnly?: boolean;
  subItems?: SubItem[];
}

export interface SidebarSection {
  heading: string;
  items: SidebarItem[];
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    heading: 'Core Platform',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Runbook Vault',
        href: '/dashboard/runbooks',
        icon: BookOpen,
        badge: 'v2.0',
        subItems: [
          { title: 'All Runbooks', href: '/dashboard/runbooks' },
          { title: 'Upload New', href: '/dashboard/runbooks/upload', badge: 'New' },
        ],
      },
      {
        title: 'AI Copilot 2.0',
        href: '/dashboard/chat',
        icon: MessageSquare,
        badge: 'AI',
        subItems: [
          { title: 'Chat Console', href: '/dashboard/chat' },
          { title: 'Chat History', href: '/dashboard/chat/history' },
        ],
      },
      {
        title: 'Execution Shell',
        href: '/dashboard/execution',
        icon: Activity,
        subItems: [
          { title: 'Active Shell', href: '/dashboard/execution' },
          { title: 'Execution Logs', href: '/dashboard/execution/history' },
        ],
      },
    ],
  },
  {
    heading: 'Intelligence & Ops',
    items: [
      {
        title: 'Incident Reports',
        href: '/dashboard/reports',
        icon: FileText,
        subItems: [
          { title: 'Report List', href: '/dashboard/reports' },
          { title: 'Report History', href: '/dashboard/reports/history' },
          { title: 'Templates', href: '/dashboard/reports/templates' },
        ],
      },
      {
        title: 'SRE Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        subItems: [
          { title: 'Overview', href: '/dashboard/analytics' },
          { title: 'Incidents', href: '/dashboard/analytics/incidents' },
          { title: 'Runbooks', href: '/dashboard/analytics/runbooks' },
          { title: 'System Health', href: '/dashboard/analytics/system-health' },
          { title: 'AI Performance', href: '/dashboard/analytics/ai-performance' },
        ],
      },
      {
        title: 'AI Operations',
        href: '/dashboard/operations',
        icon: Cpu,
        subItems: [
          { title: 'Overview', href: '/dashboard/operations' },
          { title: 'Agent Fleet', href: '/dashboard/operations/agents' },
          { title: 'Services', href: '/dashboard/operations/services' },
          { title: 'System Logs', href: '/dashboard/operations/logs' },
          { title: 'Queues', href: '/dashboard/operations/queues' },
        ],
      },
    ],
  },
  {
    heading: 'Administration',
    items: [
      {
        title: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
        badge: '3',
      },
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        subItems: [
          { title: 'General', href: '/dashboard/settings' },
          { title: 'Profile', href: '/dashboard/settings/profile' },
          { title: 'Security', href: '/dashboard/settings/security' },
          { title: 'Active Sessions', href: '/dashboard/settings/sessions' },
        ],
      },
      {
        title: 'Admin Control',
        href: '/dashboard/admin',
        icon: ShieldAlert,
        adminOnly: true,
        subItems: [
          { title: 'Overview', href: '/dashboard/admin' },
          { title: 'User Management', href: '/dashboard/admin/users' },
          { title: 'Roles & Access', href: '/dashboard/admin/roles' },
          { title: 'Permissions', href: '/dashboard/admin/permissions' },
          { title: 'Organization', href: '/dashboard/admin/organization' },
        ],
      },
      {
        title: 'Help & Docs',
        href: '/help',
        icon: HelpCircle,
        subItems: [
          { title: 'Overview', href: '/help' },
          { title: 'Documentation', href: '/help/docs' },
          { title: 'Tutorials', href: '/help/tutorials' },
          { title: 'System Status', href: '/help/system-status' },
          { title: 'Release Notes', href: '/help/release-notes' },
          { title: 'FAQ', href: '/help/faq' },
          { title: 'Contact Support', href: '/help/contact' },
        ],
      },
    ],
  },
];
