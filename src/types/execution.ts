export type StepStatus = 'COMPLETED' | 'RUNNING' | 'PENDING' | 'WAITING_APPROVAL' | 'FAILED' | 'SKIPPED';
export type RiskLevel = 'SAFE' | 'RISKY' | 'CRITICAL';

export interface ExecutionStep {
  stepNumber: number;
  title: string;
  command: string;
  description: string;
  riskLevel: RiskLevel;
  status: StepStatus;
  stdout?: string;
  stderr?: string;
  duration?: string;
  executedAt?: string;
}

export interface IncidentExecution {
  incidentId: string;
  title: string;
  issue: string;
  runbookName: string;
  status: 'ACTIVE' | 'RESOLVED' | 'WAITING_APPROVAL' | 'FAILED';
  progressPercentage: number;
  startTime: string;
  duration: string;
  steps: ExecutionStep[];
  currentStepNumber: number;
  totalCommands: number;
  successfulCommands: number;
  failedCommands: number;
  aiAgent: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
