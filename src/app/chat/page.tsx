'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { InputBox } from '@/components/chat/InputBox';
import { SuggestedPrompts } from '@/components/chat/SuggestedPrompts';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { Button } from '@/components/ui/Button';
import { useChat } from '@/hooks/useChat';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Bot, RotateCcw, ShieldCheck } from 'lucide-react';

export default function ChatPage() {
  const { isCollapsed } = useSidebarStore();
  const { messages, isTyping, activeSessionId, sendMessage, approveCommand, clearChat } = useChat();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-4">
          <Breadcrumb />

          <PageHeader
            title="AI Runbook Assistant & Execution Shell"
            description="Interactive RAG agent reasoning, live terminal execution, and risk guardrails."
            action={
              <Button variant="outline" size="sm" onClick={clearChat} leftIcon={<RotateCcw className="h-4 w-4" />}>
                Reset Session
              </Button>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Chat Interface (3 cols) */}
            <div className="lg:col-span-3 flex flex-col h-[680px] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 overflow-hidden shadow-xl">
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin space-y-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} onApproveCommand={approveCommand} />
                ))}
                {isTyping && <TypingIndicator />}
              </div>

              {/* Bottom Input Area */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
                <SuggestedPrompts
                  prompts={[
                    'Database server PostgreSQL is unresponsive',
                    'High CPU utilization alert on Node-04',
                    'Redis cache memory limit reached 95%',
                  ]}
                  onSelect={sendMessage}
                />
                <InputBox onSend={sendMessage} disabled={isTyping} />
              </div>
            </div>

            {/* Active Session Info Sidebar (1 col) */}
            <div className="space-y-4">
              <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                  <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Session Diagnostics</h3>
                </div>

                <div className="space-y-2 text-xs font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Session Ref:</span>
                    <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold">{activeSessionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Target Host:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">prod-db-node-01</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">RAG Context:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Postgres HA Manual</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-slate-950 border border-emerald-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>MCP Safe Shell Active</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Destructive shell actions auto-trigger risk prompt modals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
