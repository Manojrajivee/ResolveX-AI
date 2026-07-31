'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useSidebarStore } from '@/hooks/useSidebar';
import { useCollaborationStore } from '@/store/collaboration-store';
import {
  Bell,
  Search,
  CheckSquare,
  Pin,
  Star,
  Archive,
  Trash2,
  Brain,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Users,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export default function NotificationsPage() {
  const { isCollapsed } = useSidebarStore();
  const {
    notifications,
    activeCategory,
    searchQuery,
    tasks,
    approvals,
    calendarEvents,
    markAsRead,
    markAllAsRead,
    togglePin,
    toggleFavorite,
    archiveNotification,
    deleteNotification,
    setActiveCategory,
    setSearchQuery,
    approveCommand,
    addToast,
  } = useCollaborationStore();

  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const categories = [
    { name: 'All', count: notifications.length },
    { name: 'Unread', count: notifications.filter((n) => !n.read).length },
    { name: 'Approvals', count: approvals.length },
    { name: 'Incidents', count: notifications.filter((n) => n.category === 'Incidents').length },
    { name: 'Runbooks', count: notifications.filter((n) => n.category === 'Runbooks').length },
    { name: 'Security', count: notifications.filter((n) => n.category === 'Security').length },
    { name: 'Favorites', count: notifications.filter((n) => n.favorite).length },
    { name: 'Archived', count: notifications.filter((n) => n.archived).length },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (activeCategory === 'Unread') return !n.read;
    if (activeCategory === 'Favorites') return n.favorite;
    if (activeCategory === 'Archived') return n.archived;
    if (activeCategory !== 'All' && activeCategory !== 'Unread') return n.category === activeCategory;
    return !n.archived;
  }).filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.desc.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleGenerateSummary = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      setAiSummary('Top Incident Activity: PostgreSQL HA Primary recovered in 2m 14s. 1 Critical Approval Pending for systemctl restart. 24h RAG Retrieval Accuracy holding at 97.8%.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Unified Enterprise Notification & Collaboration Hub"
            description="Real-time multi-agent activity stream, pending human approvals, team comments, and AI daily digests."
            action={
              <Button variant="outline" size="sm" onClick={markAllAllReadWrapper} leftIcon={<CheckSquare className="h-4 w-4" />}>
                Mark All Read
              </Button>
            }
          />

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Category Sidebar (3 cols) */}
            <div className="lg:col-span-3 space-y-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">Categories</span>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeCategory === cat.name
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeCategory === cat.name ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Center Unified Feed (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notifications, incidents, or commands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium shadow-xs"
                />
              </div>

              {/* Feed Items */}
              <div className="space-y-3">
                {filteredNotifications.map((n) => (
                  <Card
                    key={n.id}
                    hoverEffect
                    className={`p-4 space-y-3 transition-all ${!n.read ? 'border-blue-500/40 bg-blue-500/10 dark:bg-blue-950/20' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {n.type === 'RISK' ? (
                            <ShieldAlert className="h-5 w-5 text-amber-500" />
                          ) : n.type === 'SUCCESS' ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Bell className="h-5 w-5 text-blue-500" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{n.title}</h4>
                            <Badge variant={n.priority === 'CRITICAL' ? 'warning' : 'info'} size="sm">
                              {n.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">{n.desc}</p>
                          <span className="text-[10px] text-slate-400 font-mono block mt-1">Source: {n.actorName || 'System'} • {n.time}</span>
                        </div>
                      </div>

                      {/* Quick Action Icons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => togglePin(n.id)} className={`p-1.5 rounded-lg text-slate-400 hover:text-blue-500 ${n.pinned ? 'text-blue-500' : ''}`}>
                          <Pin className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => toggleFavorite(n.id)} className={`p-1.5 rounded-lg text-slate-400 hover:text-amber-500 ${n.favorite ? 'text-amber-500' : ''}`}>
                          <Star className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => archiveNotification(n.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Panel: AI Digest & Collaboration (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              {/* AI Daily Digest Card */}
              <Card className="p-4 space-y-3 border-cyan-500/30 bg-cyan-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs">
                    <Sparkles className="h-4 w-4" />
                    <span>AI Operations Digest</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleGenerateSummary} isLoading={isGeneratingAi} className="text-[10px] px-2 py-1">
                    Synthesize
                  </Button>
                </div>

                {aiSummary ? (
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-white/60 dark:bg-slate-950 p-3 rounded-xl border border-cyan-500/20">
                    {aiSummary}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Click synthesize to generate AI summary of today's incident activity.</p>
                )}
              </Card>

              {/* Team Online Presence */}
              <Card className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>SRE Shift Engineers</span>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Alex Mercer', status: 'Online (On-Call)', role: 'Lead SRE' },
                    { name: 'Sarah Connor', status: 'In Incident Shell', role: 'DevOps' },
                    { name: 'David Miller', status: 'Away', role: 'Infrastructure' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white">{m.name}</h5>
                        <p className="text-[10px] text-slate-400">{m.role}</p>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );

  function markAllAllReadWrapper() {
    markAllAsRead();
    addToast({ title: 'Notifications Cleared', desc: 'All pending notifications marked as read.', variant: 'success' });
  }
}
