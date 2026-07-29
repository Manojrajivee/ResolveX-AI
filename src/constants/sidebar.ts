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
} from 'lucide-react';

export interface SidebarItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  adminOnly?: boolean;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Runbook Vault',
    href: '/runbooks',
    icon: BookOpen,
    badge: 'New',
  },
  {
    title: 'AI Assistant',
    href: '/chat',
    icon: MessageSquare,
  },
  {
    title: 'Execution Shell',
    href: '/dashboard/execution',
    icon: Activity,
  },
  {
    title: 'Incident Reports',
    href: '/reports',
    icon: FileText,
  },
  {
    title: 'SRE Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'AI Operations',
    href: '/dashboard/operations',
    icon: Cpu,
  },
  {
    title: 'Deployment Clusters',
    href: '/dashboard/deployment',
    icon: Cloud,
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
    badge: '3',
  },
  {
    title: 'Help Center',
    href: '/help',
    icon: HelpCircle,
  },
  {
    title: 'Design System',
    href: '/dashboard/design-system',
    icon: Palette,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Admin Control',
    href: '/admin',
    icon: ShieldAlert,
    adminOnly: true,
  },
];
