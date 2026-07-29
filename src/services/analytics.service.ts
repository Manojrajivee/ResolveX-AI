import { AnalyticsSummary } from '@/types/analytics';

export const AnalyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      totalRunbooks: 42,
      totalIncidents: 128,
      resolvedIncidents: 121,
      pendingIncidents: 7,
      averageResolutionTimeMinutes: 3.2,
      aiAccuracyPercentage: 97.8,
      weeklyIncidents: [
        { day: 'Mon', incidents: 12, resolved: 12 },
        { day: 'Tue', incidents: 18, resolved: 17 },
        { day: 'Wed', incidents: 25, resolved: 24 },
        { day: 'Thu', incidents: 14, resolved: 14 },
        { day: 'Fri', incidents: 22, resolved: 21 },
        { day: 'Sat', incidents: 9, resolved: 9 },
        { day: 'Sun', incidents: 8, resolved: 8 },
      ],
      incidentStatusDistribution: [
        { label: 'Resolved (Automated)', count: 98, color: '#10B981' },
        { label: 'Resolved (Human Approved)', count: 23, color: '#3B82F6' },
        { label: 'Pending Human Approval', count: 5, color: '#F59E0B' },
        { label: 'Failed / Escalated', count: 2, color: '#EF4444' },
      ],
      resolutionTimes: [
        { range: '< 1 min', count: 45 },
        { range: '1-3 mins', count: 52 },
        { range: '3-5 mins', count: 21 },
        { range: '> 5 mins', count: 10 },
      ],
    };
  },
};
