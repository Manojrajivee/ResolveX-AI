export const APP_CONFIG = {
  name: 'Runbook-Following Agent',
  shortName: 'Runbook Agent',
  version: '1.0.0',
  description: 'AI-Powered Intelligent Incident Resolution System for DevOps & SRE Teams',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  maxUploadSizeBytes: 10 * 1024 * 1024, // 10MB
  supportedFormats: ['.pdf', '.md', '.txt'],
};
