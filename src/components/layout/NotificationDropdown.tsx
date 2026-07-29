'use client';

import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Human Approval Required', desc: 'systemctl restart postgresql on prod-node-01', time: '5m ago', unread: true, risk: true },
    { id: '2', title: 'Incident INC-8941 Resolved', desc: 'Automated 2m 14s resolution complete', time: '12m ago', unread: true, risk: false },
    { id: '3', title: 'Runbook Ingested', desc: 'K8s OOMKilled Manual (18 chunks)', time: '1h ago', unread: false, risk: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-4 space-y-3 backdrop-blur-xl text-slate-900 dark:text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm">Notifications</h4>
                  {unreadCount > 0 && <Badge variant="info" size="sm">{unreadCount} New</Badge>}
                </div>
                <button onClick={markAllRead} className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Mark all read
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                      n.unread
                        ? 'bg-blue-500/10 dark:bg-blue-950/40 border-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        {n.risk ? <ShieldAlert className="h-4 w-4 text-amber-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
                <Link href="/notifications" onClick={() => setIsOpen(false)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold">
                  View All Notifications
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
