export interface AgentStatus {
  id: string;
  name: string;
  role: string;
  status: 'HEALTHY' | 'BUSY' | 'IDLE' | 'WARNING';
  currentTask?: string;
  responseTimeMs: number;
  requestsProcessed: number;
  successRatePct: number;
  cpuUsagePct: number;
  memoryUsageMb: number;
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  latencyMs: number;
  uptimePct: number;
}

export interface QueueStatus {
  name: string;
  waitingJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
}
