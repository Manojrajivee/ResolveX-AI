'use client';

import React from 'react';
import { IncidentReport } from '@/types/report';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FileText, Download, Clock } from 'lucide-react';

export interface ReportCardsProps {
  reports: IncidentReport[];
  onSelectReport: (report: IncidentReport) => void;
}

export const ReportCards: React.FC<ReportCardsProps> = ({ reports, onSelectReport }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {reports.map((rep) => (
        <Card key={rep.id} hoverEffect className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant={rep.status === 'RESOLVED' ? 'success' : 'danger'} size="sm">
                {rep.status}
              </Badge>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {rep.duration}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-1">{rep.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{rep.summary}</p>
          </div>

          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">
              <span>Incident: {rep.incidentId}</span>
              <span>{rep.executedStepsCount} Steps Run</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="w-full" onClick={() => onSelectReport(rep)} leftIcon={<FileText className="h-3.5 w-3.5" />}>
                View PDF Summary
              </Button>
              <a href={rep.pdfUrl || '#'} download className="shrink-0">
                <Button variant="secondary" size="sm" className="p-2" title="Download PDF">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
