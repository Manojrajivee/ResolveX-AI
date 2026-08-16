import { IncidentExecution } from '@/types/execution';

export const MOCK_EXECUTION: IncidentExecution = {
  incidentId: 'INC-2026-8941',
  title: 'PostgreSQL HA Node-02 Failover Sequence',
  issue: 'Primary Database Node unreachable on TCP port 5432',
  runbookName: 'PostgreSQL High Availability Recovery Guide',
  status: 'WAITING_APPROVAL',
  progressPercentage: 50,
  startTime: '2026-07-29T14:02:10Z',
  duration: '1m 24s',
  currentStepNumber: 3,
  totalCommands: 4,
  successfulCommands: 2,
  failedCommands: 0,
  aiAgent: 'LangGraph Executor Agent',
  severity: 'CRITICAL',
  steps: [
    {
      stepNumber: 1,
      title: 'Inspect PostgreSQL Process Daemon',
      command: 'systemctl status postgresql',
      description: 'Check whether daemon process is active or dead.',
      riskLevel: 'SAFE',
      status: 'COMPLETED',
      stdout: '[OK] postgresql.service - PostgreSQL RDBMS\n   Loaded: loaded (/lib/systemd/system/postgresql.service; enabled)\n   Active: inactive (dead)',
      duration: '0.8s',
      executedAt: '14:02:15',
    },
    {
      stepNumber: 2,
      title: 'Check Data Directory Storage Usage',
      command: 'df -h /var/lib/postgresql',
      description: 'Verify storage volume disk capacity limits.',
      riskLevel: 'SAFE',
      status: 'COMPLETED',
      stdout: 'Filesystem     Size  Used Avail Use% Mounted on\n/dev/sda1      100G   45G   55G  45% /var/lib/postgresql',
      duration: '0.4s',
      executedAt: '14:02:20',
    },
    {
      stepNumber: 3,
      title: 'Restart PostgreSQL Primary Daemon',
      command: 'systemctl restart postgresql',
      description: 'Attempt service daemon recovery to restore cluster responsiveness.',
      riskLevel: 'RISKY',
      status: 'WAITING_APPROVAL',
      stdout: 'Waiting for human SRE authorization for RISKY operation...',
    },
    {
      stepNumber: 4,
      title: 'Verify Socket & DB Port Response',
      command: 'pg_isready -h localhost -p 5432',
      description: 'Confirm database listener socket is accepting connections.',
      riskLevel: 'SAFE',
      status: 'PENDING',
    },
  ],
};

export const ExecutionService = {
  async getExecution(incidentId?: string): Promise<IncidentExecution> {
    return MOCK_EXECUTION;
  },

  async approveStep(stepNumber: number): Promise<IncidentExecution> {
    const updated = { ...MOCK_EXECUTION };
    updated.steps = updated.steps.map((s) => {
      if (s.stepNumber === stepNumber) {
        return {
          ...s,
          status: 'COMPLETED',
          stdout: '[OK] systemctl restart postgresql completed successfully. Daemon PID: 19482',
          duration: '2.1s',
        };
      }
      if (s.stepNumber === stepNumber + 1) {
        return {
          ...s,
          status: 'COMPLETED',
          stdout: 'localhost:5432 - accepting connections',
          duration: '0.5s',
        };
      }
      return s;
    });
    updated.status = 'RESOLVED';
    updated.progressPercentage = 100;
    return updated;
  },
};

