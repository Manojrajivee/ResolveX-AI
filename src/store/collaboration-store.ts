import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'RISK' | 'SUCCESS' | 'INFO' | 'INCIDENT' | 'RUNBOOK' | 'SECURITY';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  pinned?: boolean;
  favorite?: boolean;
  archived?: boolean;
  actorName?: string;
  actorAvatar?: string;
}

export interface ToastItem {
  id: string;
  title: string;
  desc?: string;
  variant: 'success' | 'error' | 'warning' | 'info' | 'critical';
  durationMs?: number;
}

export interface PendingTask {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface PendingApproval {
  id: string;
  incidentId: string;
  command: string;
  requestedBy: string;
  riskLevel: 'HIGH' | 'CRITICAL';
  timestamp: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'MAINTENANCE' | 'DEPLOYMENT' | 'REVIEW';
}

interface CollaborationStore {
  notifications: NotificationItem[];
  toasts: ToastItem[];
  tasks: PendingTask[];
  approvals: PendingApproval[];
  calendarEvents: CalendarEvent[];
  activeCategory: string;
  searchQuery: string;
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  togglePin: (id: string) => void;
  toggleFavorite: (id: string) => void;
  archiveNotification: (id: string) => void;
  deleteNotification: (id: string) => void;
  setActiveCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  approveCommand: (id: string) => void;
  rejectCommand: (id: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Human Risk Approval Intercepted',
    desc: 'Command [systemctl restart postgresql] requires SRE confirmation on node-01.',
    time: '3m ago',
    read: false,
    type: 'RISK',
    priority: 'CRITICAL',
    category: 'Approvals',
    pinned: true,
    actorName: 'Planner Agent',
  },
  {
    id: 'n-2',
    title: 'Incident Resolved Automatically',
    desc: 'PostgreSQL HA primary recovered cleanly. Inc-2026-8941 closed in 2m 14s.',
    time: '12m ago',
    read: false,
    type: 'SUCCESS',
    priority: 'HIGH',
    category: 'Incidents',
    favorite: true,
    actorName: 'Decision Agent',
  },
  {
    id: 'n-3',
    title: 'New Runbook Manual Ingested',
    desc: 'PostgreSQL HA Manual parsed into 12 vector chunks in ChromaDB.',
    time: '1h ago',
    read: true,
    type: 'RUNBOOK',
    priority: 'MEDIUM',
    category: 'Runbooks',
    actorName: 'Alex Mercer',
  },
  {
    id: 'n-4',
    title: 'Security Score Updated to 98/100',
    desc: '2FA enforced across all Site Reliability Engineering admin accounts.',
    time: '2h ago',
    read: true,
    type: 'SECURITY',
    priority: 'LOW',
    category: 'Security',
    actorName: 'Security Audit',
  },
  {
    id: 'n-5',
    title: 'Weekly Executive SRE Report Ready',
    desc: 'PDF summary generated for 128 resolved incidents with 91% MTTR reduction.',
    time: '5h ago',
    read: true,
    type: 'INFO',
    priority: 'LOW',
    category: 'Reports',
    actorName: 'Reporter Agent',
  },
];

const INITIAL_TASKS: PendingTask[] = [
  { id: 't-1', title: 'Review ChromaDB Vector Store Indexing', assignee: 'Alex Mercer', dueDate: 'Today, 5:00 PM', priority: 'HIGH', status: 'IN_PROGRESS' },
  { id: 't-2', title: 'Verify MCP Tool Sandbox Allowlist Rules', assignee: 'Sarah Connor', dueDate: 'Tomorrow, 10:00 AM', priority: 'CRITICAL', status: 'PENDING' },
  { id: 't-3', title: 'Audit Spring Boot JWT Key Rotation', assignee: 'David Miller', dueDate: 'Jul 31, 2026', priority: 'MEDIUM', status: 'PENDING' },
];

const INITIAL_APPROVALS: PendingApproval[] = [
  { id: 'app-1', incidentId: 'INC-2026-8941', command: 'systemctl restart postgresql', requestedBy: 'ExecutionAgent', riskLevel: 'HIGH', timestamp: '3m ago' },
  { id: 'app-2', incidentId: 'INC-2026-8944', command: 'kubectl scale deployment/api-server --replicas=8', requestedBy: 'PlannerAgent', riskLevel: 'CRITICAL', timestamp: '25m ago' },
];

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'e-1', title: 'PostgreSQL Cluster Maintenance', date: 'Jul 31, 2026', time: '02:00 UTC', type: 'MAINTENANCE' },
  { id: 'e-2', title: 'v2.4 Production Release Deployment', date: 'Aug 02, 2026', time: '14:00 UTC', type: 'DEPLOYMENT' },
];

export const useCollaborationStore = create<CollaborationStore>((set) => ({
  notifications: INITIAL_NOTIFICATIONS,
  toasts: [],
  tasks: INITIAL_TASKS,
  approvals: INITIAL_APPROVALS,
  calendarEvents: INITIAL_EVENTS,
  activeCategory: 'All',
  searchQuery: '',
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { id: `toast-${Date.now()}`, ...toast }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  togglePin: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    })),
  toggleFavorite: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n)),
    })),
  archiveNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, archived: true } : n)),
    })),
  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  approveCommand: (id) =>
    set((state) => ({
      approvals: state.approvals.filter((a) => a.id !== id),
    })),
  rejectCommand: (id) =>
    set((state) => ({
      approvals: state.approvals.filter((a) => a.id !== id),
    })),
}));
