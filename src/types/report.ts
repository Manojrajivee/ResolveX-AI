export interface IncidentReport {
  id: string;
  incidentId: string;
  title: string;
  issue: string;
  status: 'RESOLVED' | 'INVESTIGATING' | 'FAILED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  resolvedBy: string;
  duration: string;
  executedStepsCount: number;
  pdfUrl?: string;
  summary: string;
  createdAt: string;
}
