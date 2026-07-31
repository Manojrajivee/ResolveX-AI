'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollaborationStore } from '@/store/collaboration-store';
import { CheckCircle2, ShieldAlert, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCollaborationStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl flex items-start gap-3 text-xs ${
              toast.variant === 'critical' || toast.variant === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-100'
                : toast.variant === 'warning'
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100'
                : toast.variant === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                : 'bg-slate-900/90 border-blue-500/50 text-slate-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.variant === 'critical' || toast.variant === 'error' ? (
                <ShieldAlert className="h-5 w-5 text-rose-400" />
              ) : toast.variant === 'warning' ? (
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              ) : toast.variant === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <Info className="h-5 w-5 text-blue-400" />
              )}
            </div>

            <div className="flex-1 space-y-0.5">
              <h5 className="font-bold text-sm">{toast.title}</h5>
              {toast.desc && <p className="opacity-90 leading-relaxed font-medium">{toast.desc}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 transition-all shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
