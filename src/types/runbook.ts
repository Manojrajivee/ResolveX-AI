export type RunbookFormat = 'PDF' | 'MARKDOWN' | 'TXT';

export interface RunbookStep {
  stepNumber: number;
  title: string;
  command?: string;
  description: string;
  riskLevel: 'SAFE' | 'RISKY' | 'CRITICAL';
}

export interface Runbook {
  id: string;
  title: string;
  description: string;
  format: RunbookFormat;
  filePath: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  chunksCount: number;
  steps: RunbookStep[];
  category: string;
  tags: string[];
}
