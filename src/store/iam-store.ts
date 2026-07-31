import { create } from 'zustand';

export interface IAMUser {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: string;
  department: string;
  designation: string;
  organization: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastActive: string;
  location: string;
  timezone: string;
  securityScore: number;
  twoFactorEnabled: boolean;
  avatarUrl?: string;
  bio?: string;
  skills: string[];
}

export interface IAMRole {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  usersCount: number;
  permissionsCount: number;
  category: 'ADMIN' | 'ENGINEERING' | 'AUDIT' | 'CUSTOM';
}

export interface GranularPermissions {
  runbooks: { read: boolean; write: boolean; delete: boolean; execute: boolean; approve: boolean };
  incidents: { read: boolean; write: boolean; delete: boolean; execute: boolean; approve: boolean };
  aiExecutions: { read: boolean; execute: boolean; approve: boolean; override: boolean };
  reports: { read: boolean; create: boolean; export: boolean; delete: boolean };
  operations: { read: boolean; manageServices: boolean; manageAgents: boolean };
  organization: { read: boolean; manageUsers: boolean; manageRoles: boolean; manageBilling: boolean };
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  loginTime: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARN' | 'FAILURE';
  ip: string;
  details: string;
}

interface IAMStore {
  users: IAMUser[];
  roles: IAMRole[];
  permissions: GranularPermissions;
  sessions: ActiveSession[];
  auditLogs: AuditLogItem[];
  organization: {
    name: string;
    domain: string;
    plan: string;
    membersCount: number;
    teamsCount: number;
    departments: string[];
  };
  addUser: (user: Partial<IAMUser>) => void;
  updateUserStatus: (id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => void;
  deleteUser: (id: string) => void;
  terminateSession: (id: string) => void;
  terminateAllOtherSessions: () => void;
  updatePermissions: (newPerms: GranularPermissions) => void;
  addAuditLog: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;
}

const INITIAL_USERS: IAMUser[] = [
  {
    id: 'usr-1',
    name: 'Alex Mercer',
    email: 'alex.mercer@enterprise.com',
    employeeId: 'EMP-9041',
    role: 'Super Admin',
    department: 'Site Reliability Engineering',
    designation: 'Principal SRE Architect',
    organization: 'Enterprise Infrastructure Global',
    status: 'ACTIVE',
    lastActive: 'Just now',
    location: 'San Francisco, CA, USA',
    timezone: 'PST (UTC-8)',
    securityScore: 98,
    twoFactorEnabled: true,
    skills: ['Kubernetes', 'PostgreSQL', 'LangGraph', 'Terraform', 'MCP Shell'],
    bio: 'Lead SRE Architect responsible for autonomous incident response and AI safety guardrails.',
  },
  {
    id: 'usr-2',
    name: 'Sarah Connor',
    email: 'sarah.connor@enterprise.com',
    employeeId: 'EMP-8820',
    role: 'Operations Manager',
    department: 'DevOps & Cloud Operations',
    designation: 'Senior Cloud Lead',
    organization: 'Enterprise Infrastructure Global',
    status: 'ACTIVE',
    lastActive: '12m ago',
    location: 'Austin, TX, USA',
    timezone: 'CST (UTC-6)',
    securityScore: 92,
    twoFactorEnabled: true,
    skills: ['AWS', 'Docker', 'Prometheus', 'Grafana'],
  },
  {
    id: 'usr-3',
    name: 'David Miller',
    email: 'david.miller@enterprise.com',
    employeeId: 'EMP-7412',
    role: 'DevOps Engineer',
    department: 'Infrastructure Core',
    designation: 'DevOps Specialist',
    organization: 'Enterprise Infrastructure Global',
    status: 'ACTIVE',
    lastActive: '1h ago',
    location: 'London, UK',
    timezone: 'GMT (UTC+0)',
    securityScore: 86,
    twoFactorEnabled: false,
    skills: ['Linux Kernel', 'Nginx', 'Certbot', 'Spring Boot'],
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@enterprise.com',
    employeeId: 'EMP-6109',
    role: 'Auditor',
    department: 'Security & Compliance',
    designation: 'Lead Security Compliance Analyst',
    organization: 'Enterprise Infrastructure Global',
    status: 'INACTIVE',
    lastActive: '3d ago',
    location: 'Berlin, Germany',
    timezone: 'CET (UTC+1)',
    securityScore: 95,
    twoFactorEnabled: true,
    skills: ['SOC-2', 'ISO-27001', 'IAM Audit', 'Risk Analysis'],
  },
];

const INITIAL_ROLES: IAMRole[] = [
  { id: 'role-1', name: 'Super Admin', description: 'Unrestricted administrative control across all organizations and system settings.', isSystem: true, usersCount: 1, permissionsCount: 42, category: 'ADMIN' },
  { id: 'role-2', name: 'Administrator', description: 'Full management of users, roles, runbooks, and incident execution graphs.', isSystem: true, usersCount: 3, permissionsCount: 38, category: 'ADMIN' },
  { id: 'role-3', name: 'Operations Manager', description: 'Manages live incident resolutions, approves risky commands, and generates PDF reports.', isSystem: true, usersCount: 5, permissionsCount: 28, category: 'ENGINEERING' },
  { id: 'role-4', name: 'DevOps Engineer', description: 'Uploads SOP runbooks, triggers AI executions, and inspects agent logs.', isSystem: true, usersCount: 12, permissionsCount: 22, category: 'ENGINEERING' },
  { id: 'role-5', name: 'Auditor', description: 'Read-only access to audit logs, compliance timelines, and security scores.', isSystem: true, usersCount: 4, permissionsCount: 10, category: 'AUDIT' },
  { id: 'role-6', name: 'Viewer', description: 'Read-only access to runbook documentation and incident reports.', isSystem: true, usersCount: 18, permissionsCount: 5, category: 'CUSTOM' },
];

const INITIAL_SESSIONS: ActiveSession[] = [
  { id: 'sess-1', device: 'MacBook Pro 16"', browser: 'Chrome 124.0', os: 'macOS Sonoma', ip: '192.168.1.104', location: 'San Francisco, CA, USA', loginTime: 'Today at 09:14 AM', lastActive: 'Active Now', isCurrent: true },
  { id: 'sess-2', device: 'iPhone 15 Pro', browser: 'Mobile Safari 17.4', os: 'iOS 17.4', ip: '172.20.10.2', location: 'San Francisco, CA, USA', loginTime: 'Yesterday at 04:30 PM', lastActive: '2h ago', isCurrent: false },
  { id: 'sess-3', device: 'Workstation PC', browser: 'Firefox 125.0', os: 'Windows 11 Enterprise', ip: '10.0.4.88', location: 'London, UK', loginTime: '3 days ago', lastActive: '3d ago', isCurrent: false },
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  { id: 'log-1', actor: 'Alex Mercer', action: 'ROLE_ASSIGNED', target: 'Sarah Connor -> Operations Manager', timestamp: '10m ago', status: 'SUCCESS', ip: '192.168.1.104', details: 'Assigned elevated SRE approval privileges' },
  { id: 'log-2', actor: 'Alex Mercer', action: 'RISK_APPROVAL_GRANTED', target: 'Command: systemctl restart postgresql', timestamp: '34m ago', status: 'SUCCESS', ip: '192.168.1.104', details: 'Authorized safe shell execution via MCP' },
  { id: 'log-3', actor: 'David Miller', action: 'PASSWORD_RESET_REQUESTED', target: 'david.miller@enterprise.com', timestamp: '2h ago', status: 'WARN', ip: '10.0.4.88', details: 'OTP code sent to email' },
  { id: 'log-4', actor: 'System Auto-Guard', action: 'SESSION_TERMINATED', target: 'Expired token for Elena Rostova', timestamp: '1d ago', status: 'SUCCESS', ip: '127.0.0.1', details: 'Automated 24h idle session cleanup' },
];

export const useIAMStore = create<IAMStore>((set) => ({
  users: INITIAL_USERS,
  roles: INITIAL_ROLES,
  permissions: {
    runbooks: { read: true, write: true, delete: true, execute: true, approve: true },
    incidents: { read: true, write: true, delete: true, execute: true, approve: true },
    aiExecutions: { read: true, execute: true, approve: true, override: true },
    reports: { read: true, create: true, export: true, delete: true },
    operations: { read: true, manageServices: true, manageAgents: true },
    organization: { read: true, manageUsers: true, manageRoles: true, manageBilling: true },
  },
  sessions: INITIAL_SESSIONS,
  auditLogs: INITIAL_AUDIT_LOGS,
  organization: {
    name: 'Enterprise Infrastructure Global',
    domain: 'enterprise.com',
    plan: 'Enterprise SRE Unlimited',
    membersCount: 42,
    teamsCount: 8,
    departments: ['Site Reliability Engineering', 'DevOps & Cloud Operations', 'Infrastructure Core', 'Security & Compliance', 'Database Platform'],
  },
  addUser: (partialUser) =>
    set((state) => ({
      users: [
        {
          id: `usr-${Date.now()}`,
          name: partialUser.name || 'New Member',
          email: partialUser.email || 'user@enterprise.com',
          employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          role: partialUser.role || 'DevOps Engineer',
          department: partialUser.department || 'Site Reliability Engineering',
          designation: partialUser.designation || 'Engineer',
          organization: state.organization.name,
          status: 'ACTIVE',
          lastActive: 'Just invited',
          location: 'San Francisco, CA',
          timezone: 'PST (UTC-8)',
          securityScore: 90,
          twoFactorEnabled: true,
          skills: ['DevOps', 'Incident Response'],
        },
        ...state.users,
      ],
    })),
  updateUserStatus: (id, status) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status } : u)),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
  terminateSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    })),
  terminateAllOtherSessions: () =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.isCurrent),
    })),
  updatePermissions: (newPerms) => set({ permissions: newPerms }),
  addAuditLog: (log) =>
    set((state) => ({
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Just now',
          ...log,
        },
        ...state.auditLogs,
      ],
    })),
}));
