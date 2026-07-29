'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { BookOpen, ShieldAlert, CheckCircle, Clock, Cpu, FileCheck } from 'lucide-react';

export interface DashboardCardsProps {
  metrics?: {
    totalRunbooks: number;
    totalIncidents: number;
    resolvedCount: number;
    avgResolutionTime: string;
    aiAccuracy: string;
    activeSessions: number;
  };
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({
  metrics = {
    totalRunbooks: 42,
    totalIncidents: 128,
    resolvedCount: 121,
    avgResolutionTime: '3.2m',
    aiAccuracy: '97.8%',
    activeSessions: 3,
  },
}) => {
  const cards = [
    {
      title: 'Indexed Runbooks',
      value: metrics.totalRunbooks,
      sub: 'Parsed in ChromaDB RAG',
      icon: BookOpen,
      color: 'from-blue-600 to-cyan-500',
      badge: '+12%',
      badgePositive: true,
    },
    {
      title: 'Total Incidents',
      value: metrics.totalIncidents,
      sub: 'All-time SRE alerts',
      icon: ShieldAlert,
      color: 'from-amber-500 to-orange-600',
      badge: 'Active',
      badgePositive: false,
    },
    {
      title: 'Resolved Incidents',
      value: metrics.resolvedCount,
      sub: '94.5% resolution rate',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600',
      badge: '+94.5%',
      badgePositive: true,
    },
    {
      title: 'Avg Resolution Time',
      value: metrics.avgResolutionTime,
      sub: 'Down from 35m human MTTR',
      icon: Clock,
      color: 'from-purple-600 to-indigo-600',
      badge: '-90%',
      badgePositive: true,
    },
    {
      title: 'AI Step Accuracy',
      value: metrics.aiAccuracy,
      sub: 'LLM reasoning score',
      icon: Cpu,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Optimal',
      badgePositive: true,
    },
    {
      title: 'Active AI Sessions',
      value: metrics.activeSessions,
      sub: 'Live incident workflows',
      icon: FileCheck,
      color: 'from-emerald-500 to-cyan-600',
      badge: 'Live',
      badgePositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card key={i} hoverEffect className="relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:scale-105 transition-transform origin-left">
                  {card.value}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    card.badgePositive 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {card.badge}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{card.sub}</p>
                </div>
              </div>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${card.color} shadow-lg shadow-blue-500/15`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
