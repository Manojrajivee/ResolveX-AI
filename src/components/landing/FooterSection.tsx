import React from 'react';
import Link from 'next/link';
import { Bot, Globe, Share2, Code2, ShieldCheck } from 'lucide-react';

export const FooterSection: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-16 px-4 sm:px-6 lg:px-8 text-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-200/80 dark:border-slate-800/80">
        {/* Brand Column (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <Link href="#home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
              <Bot className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-wide">Runbook Agent</span>
          </Link>
          <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed font-medium">
            AI-Powered Intelligent Incident Resolution System. Automatically reads Runbooks, plans execution, and safely runs commands via Model Context Protocol (MCP).
          </p>
          <div className="flex items-center gap-3 pt-2 text-slate-500 dark:text-slate-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-colors shadow-2xs" title="GitHub Repository">
              <Code2 className="h-4 w-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-colors shadow-2xs" title="Social Feed">
              <Share2 className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-colors shadow-2xs" title="Network">
              <Globe className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider font-mono">Platform</h4>
          <ul className="space-y-2 font-medium">
            <li><a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a></li>
            <li><a href="#workflow" className="hover:text-slate-900 dark:hover:text-white transition-colors">AI Workflow</a></li>
            <li><a href="#agents" className="hover:text-slate-900 dark:hover:text-white transition-colors">Multi-Agent System</a></li>
            <li><a href="#architecture" className="hover:text-slate-900 dark:hover:text-white transition-colors">System Architecture</a></li>
            <li><a href="#stack" className="hover:text-slate-900 dark:hover:text-white transition-colors">Technology Stack</a></li>
          </ul>
        </div>

        {/* Product & Docs */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider font-mono">Documentation</h4>
          <ul className="space-y-2 font-medium">
            <li><Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard Portal</Link></li>
            <li><Link href="/runbooks" className="hover:text-slate-900 dark:hover:text-white transition-colors">Runbook Vault</Link></li>
            <li><Link href="/chat" className="hover:text-slate-900 dark:hover:text-white transition-colors">AI Execution Shell</Link></li>
            <li><Link href="/reports" className="hover:text-slate-900 dark:hover:text-white transition-colors">Incident Reports</Link></li>
            <li><a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">MCP Protocol Specs</a></li>
          </ul>
        </div>

        {/* Legal & Security */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider font-mono">Enterprise</h4>
          <ul className="space-y-2 font-medium">
            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Security Policy</a></li>
            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Statement</a></li>
            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Command Allowlist Rules</a></li>
            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Docker Sandbox Spec</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <p>© 2026 Runbook Following Agent. Enterprise Autonomous SRE Incident Resolution Engine.</p>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>SOC-2 Type II Certified Architecture</span>
        </div>
      </div>
    </footer>
  );
};
