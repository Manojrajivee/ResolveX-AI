import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/40 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto font-medium">
        <p>© 2026 Runbook Following Agent. Enterprise SRE Incident Resolution Engine.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Documentation</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">MCP Protocol Specs</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Security Policy</a>
        </div>
      </div>
    </footer>
  );
};
