import { create } from 'zustand';
import { Runbook } from '@/types/runbook';

interface RunbookStore {
  runbooks: Runbook[];
  selectedRunbook: Runbook | null;
  addRunbook: (rb: Runbook) => void;
  deleteRunbook: (id: string) => void;
  selectRunbook: (rb: Runbook | null) => void;
}

export const MOCK_RUNBOOKS: Runbook[] = [
  {
    id: 'rb-1',
    title: 'PostgreSQL High Availability Recovery',
    description: 'Step-by-step diagnostic and failover procedure for PostgreSQL primary cluster failures.',
    format: 'MARKDOWN',
    filePath: '/uploads/markdown/postgres-ha-recovery.md',
    fileSize: '245 KB',
    uploadedBy: 'Alex Mercer',
    uploadedAt: '2026-07-28T14:30:00Z',
    chunksCount: 12,
    category: 'Database',
    tags: ['postgresql', 'failover', 'database', 'high-availability'],
    steps: [
      { stepNumber: 1, title: 'Check DB Service Status', command: 'systemctl status postgresql', description: 'Verify if the daemon process is active or terminated.', riskLevel: 'SAFE' },
      { stepNumber: 2, title: 'Check Storage & Disk Usage', command: 'df -h /var/lib/postgresql', description: 'Ensure storage volume is not full.', riskLevel: 'SAFE' },
      { stepNumber: 3, title: 'Restart Service Daemon', command: 'systemctl restart postgresql', description: 'Attempt service daemon recovery.', riskLevel: 'RISKY' },
      { stepNumber: 4, title: 'Verify Connection Health', command: 'pg_isready -h localhost -p 5432', description: 'Confirm database listener socket is responsive.', riskLevel: 'SAFE' },
    ],
  },
  {
    id: 'rb-2',
    title: 'Kubernetes Pod Out Of Memory (OOMKilled) Fix',
    description: 'Procedure to identify memory leak containers and scale horizontal pod autoscalers.',
    format: 'PDF',
    filePath: '/uploads/pdf/k8s-oom-recovery.pdf',
    fileSize: '1.4 MB',
    uploadedBy: 'Sarah Connor',
    uploadedAt: '2026-07-27T09:15:00Z',
    chunksCount: 18,
    category: 'Infrastructure',
    tags: ['kubernetes', 'oomkilled', 'memory', 'docker'],
    steps: [
      { stepNumber: 1, title: 'Get Pod Status', command: 'kubectl get pods -n production', description: 'Identify crash-looping or OOMKilled pods.', riskLevel: 'SAFE' },
      { stepNumber: 2, title: 'Describe Pod Logs', command: 'kubectl logs --previous -n production <pod-id>', description: 'Retrieve exit code and stack trace prior to crash.', riskLevel: 'SAFE' },
    ],
  },
  {
    id: 'rb-3',
    title: 'Nginx Reverse Proxy & SSL Renewal Guide',
    description: 'Handling HTTP 502 Bad Gateway errors and certbot renewal execution.',
    format: 'TXT',
    filePath: '/uploads/txt/nginx-ssl-guide.txt',
    fileSize: '88 KB',
    uploadedBy: 'David Miller',
    uploadedAt: '2026-07-25T11:00:00Z',
    chunksCount: 8,
    category: 'Web Services',
    tags: ['nginx', 'ssl', 'proxy', 'http-502'],
    steps: [
      { stepNumber: 1, title: 'Test Nginx Syntax', command: 'nginx -t', description: 'Validate configuration syntax.', riskLevel: 'SAFE' },
      { stepNumber: 2, title: 'Reload Nginx', command: 'systemctl reload nginx', description: 'Apply non-disruptive configuration update.', riskLevel: 'SAFE' },
    ],
  },
];

export const useRunbookStore = create<RunbookStore>((set) => ({
  runbooks: MOCK_RUNBOOKS,
  selectedRunbook: MOCK_RUNBOOKS[0],
  addRunbook: (rb) => set((state) => ({ runbooks: [rb, ...state.runbooks] })),
  deleteRunbook: (id) =>
    set((state) => ({
      runbooks: state.runbooks.filter((r) => r.id !== id),
    })),
  selectRunbook: (rb) => set({ selectedRunbook: rb }),
}));
