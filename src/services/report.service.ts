import { IncidentReport } from '@/types/report';

export const MOCK_REPORTS: IncidentReport[] = [
  {
    id: 'rep-1',
    incidentId: 'INC-2026-8941',
    title: 'PostgreSQL HA Node-02 Failover Summary',
    issue: 'Database Server Unresponsive on port 5432',
    status: 'RESOLVED',
    severity: 'CRITICAL',
    resolvedBy: 'Runbook AI Agent (Approved by Alex Mercer)',
    duration: '2m 14s',
    executedStepsCount: 4,
    pdfUrl: '/reports/INC-2026-8941.pdf',
    summary: 'PostgreSQL primary cluster unresponsive state was identified. Safe status diagnostic confirmed daemon crash. User approved systemctl restart postgresql, successfully recovering cluster.',
    createdAt: '2026-07-29T14:05:30Z',
  },
  {
    id: 'rep-2',
    incidentId: 'INC-2026-8920',
    title: 'Nginx SSL Certificate Auto-Renewal & Reload',
    issue: 'HTTP 502 Bad Gateway - Certbot Expired',
    status: 'RESOLVED',
    severity: 'MEDIUM',
    resolvedBy: 'Runbook AI Agent',
    duration: '1m 05s',
    executedStepsCount: 3,
    pdfUrl: '/reports/INC-2026-8920.pdf',
    summary: 'Certbot dry-run executed successfully. Non-disruptive nginx reload cleared gateway timeouts.',
    createdAt: '2026-07-28T09:12:00Z',
  },
  {
    id: 'rep-3',
    incidentId: 'INC-2026-8894',
    title: 'Kubernetes OOMKilled Container Scale Out',
    issue: 'Payment Service Pod CrashLoopBackOff',
    status: 'RESOLVED',
    severity: 'HIGH',
    resolvedBy: 'Sarah Connor',
    duration: '4m 30s',
    executedStepsCount: 5,
    pdfUrl: '/reports/INC-2026-8894.pdf',
    summary: 'Identified memory exhaustion. Scaled deployment horizontal pod autoscaler to 5 replicas.',
    createdAt: '2026-07-27T16:45:00Z',
  },
];

export const ReportService = {
  async getReports(): Promise<IncidentReport[]> {
    return MOCK_REPORTS;
  },

  async getReportById(id: string): Promise<IncidentReport | undefined> {
    return MOCK_REPORTS.find((r) => r.id === id);
  },
};
