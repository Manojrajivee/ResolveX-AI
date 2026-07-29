import { AgentStatus, ServiceHealth, QueueStatus } from '@/types/operations';

export const MOCK_AGENTS: AgentStatus[] = [
  { id: 'ag-1', name: 'Planner Agent', role: 'LangGraph SOP Graph Generator', status: 'HEALTHY', responseTimeMs: 96, requestsProcessed: 1420, successRatePct: 98.5, cpuUsagePct: 24, memoryUsageMb: 512, currentTask: 'Synthesizing PostgreSQL Recovery Plan' },
  { id: 'ag-2', name: 'Retrieval Agent', role: 'ChromaDB Vector Embedding Search', status: 'HEALTHY', responseTimeMs: 81, requestsProcessed: 3200, successRatePct: 99.4, cpuUsagePct: 18, memoryUsageMb: 768, currentTask: 'Top-1 Cosine Similarity Lookup' },
  { id: 'ag-3', name: 'Execution Agent', role: 'MCP Safe Shell Sandbox Runner', status: 'BUSY', responseTimeMs: 128, requestsProcessed: 890, successRatePct: 97.2, cpuUsagePct: 45, memoryUsageMb: 1024, currentTask: 'Streaming stdout for INC-8941' },
  { id: 'ag-4', name: 'Decision Agent', role: 'Human SRE Risk Interceptor', status: 'HEALTHY', responseTimeMs: 75, requestsProcessed: 540, successRatePct: 100, cpuUsagePct: 12, memoryUsageMb: 384 },
  { id: 'ag-5', name: 'Reporter Agent', role: 'PDF Brief Auto-Generator', status: 'HEALTHY', responseTimeMs: 110, requestsProcessed: 210, successRatePct: 99.1, cpuUsagePct: 15, memoryUsageMb: 450 },
];

export const MOCK_SERVICES: ServiceHealth[] = [
  { id: 'srv-1', name: 'Spring Boot REST Gateway', status: 'HEALTHY', latencyMs: 12, uptimePct: 99.98 },
  { id: 'srv-2', name: 'MongoDB Incident Log Store', status: 'HEALTHY', latencyMs: 4, uptimePct: 100 },
  { id: 'srv-3', name: 'ChromaDB Vector Store', status: 'HEALTHY', latencyMs: 18, uptimePct: 99.95 },
  { id: 'srv-4', name: 'MCP Safe Shell Sandbox', status: 'HEALTHY', latencyMs: 2, uptimePct: 100 },
];

export const OperationsService = {
  async getAgents(): Promise<AgentStatus[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_AGENTS;
  },
  async getServices(): Promise<ServiceHealth[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_SERVICES;
  },
};
