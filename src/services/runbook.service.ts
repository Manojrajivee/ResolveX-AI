import { Runbook } from '@/types/runbook';
import { MOCK_RUNBOOKS } from '@/store/runbook-store';

export const RunbookService = {
  async getRunbooks(): Promise<Runbook[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_RUNBOOKS;
  },

  async getRunbookById(id: string): Promise<Runbook | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_RUNBOOKS.find((r) => r.id === id);
  },

  async uploadRunbook(file: File, title: string, category: string): Promise<Runbook> {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const extension = file.name.split('.').pop()?.toUpperCase() as 'PDF' | 'MARKDOWN' | 'TXT';
    
    return {
      id: `rb-${Date.now()}`,
      title: title || file.name,
      description: `Uploaded file ${file.name} - automatically chunked and indexed in ChromaDB vector store.`,
      format: extension || 'MARKDOWN',
      filePath: `/uploads/${file.name}`,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedBy: 'Alex Mercer',
      uploadedAt: new Date().toISOString(),
      chunksCount: Math.floor(Math.random() * 15) + 5,
      category: category || 'DevOps',
      tags: [category.toLowerCase(), 'runbook', 'ai-parsed'],
      steps: [
        { stepNumber: 1, title: 'Check Service Metrics', command: 'ps aux', description: 'Validate operational status.', riskLevel: 'SAFE' },
        { stepNumber: 2, title: 'Verify Log Tail', command: 'tail -n 50 /var/log/syslog', description: 'Scan for error logs.', riskLevel: 'SAFE' },
      ],
    };
  },

  async deleteRunbook(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return true;
  },
};
