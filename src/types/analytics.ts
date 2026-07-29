export interface AnalyticsSummary {
  totalRunbooks: number;
  totalIncidents: number;
  resolvedIncidents: number;
  pendingIncidents: number;
  averageResolutionTimeMinutes: number;
  aiAccuracyPercentage: number;
  weeklyIncidents: { day: string; incidents: number; resolved: number }[];
  incidentStatusDistribution: { label: string; count: number; color: string }[];
  resolutionTimes: { range: string; count: number }[];
}
