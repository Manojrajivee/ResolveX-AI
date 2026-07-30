'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { InputBox } from '@/components/chat/InputBox';
import { SuggestedPrompts } from '@/components/chat/SuggestedPrompts';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { ChatHistorySidebar } from '@/components/chat/ChatHistorySidebar';
import { LangGraphWorkflow } from '@/components/chat/LangGraphWorkflow';
import { RunbookReferencesPanel } from '@/components/chat/RunbookReferencesPanel';
import { RiskAnalysisCard } from '@/components/chat/RiskAnalysisCard';
import { IncidentSummaryCard } from '@/components/chat/IncidentSummaryCard';
import { VoiceInputButton } from '@/components/chat/VoiceInputButton';
import { Button } from '@/components/ui/Button';
import { useChat } from '@/hooks/useChat';
import { RotateCcw, Sparkles, PanelRightOpen, PanelRightClose } from 'lucide-react';

export default function ChatConsolePage() {
  const { messages, isTyping, activeSessionId, sendMessage, approveCommand, clearChat } = useChat();
  const [activeSession, setActiveSession] = useState('sess-1');
  const [showRightPanel, setShowRightPanel] = useState(true);

  const handlePromptSelect = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Enterprise AI Incident Copilot 2.0"
        description="Autonomous LangGraph multi-agent RAG workflow, risk guardrails, and executable command cards."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRightPanel(!showRightPanel)}
              leftIcon={showRightPanel ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            >
              {showRightPanel ? 'Hide Intelligence Panel' : 'Show Intelligence Panel'}
            </Button>
            <Button variant="outline" size="sm" onClick={clearChat} leftIcon={<RotateCcw className="h-4 w-4" />}>
              Reset Session
            </Button>
          </div>
        }
      />

      {/* 3-Column Enterprise AI Copilot Layout */}
      <div className="flex h-[750px] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Column 1: History Sidebar */}
        <ChatHistorySidebar
          activeId={activeSession}
          onSelectSession={(id) => setActiveSession(id)}
          onNewChat={clearChat}
        />

        {/* Column 2: Center Interactive Chat */}
        <div className="flex-1 flex flex-col h-full bg-white/40 dark:bg-slate-950/40 p-4 sm:p-6 overflow-hidden min-w-0">
          {/* Message Feed */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} onApproveCommand={approveCommand} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>

          {/* Prompt Box & Suggestions */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3 shrink-0">
            <SuggestedPrompts
              prompts={[
                'Database server PostgreSQL is unresponsive',
                'High CPU utilization alert on Node-04',
                'Redis cache memory limit reached 95%',
                'Restart Nginx service daemon',
              ]}
              onSelect={handlePromptSelect}
            />

            <div className="flex items-center gap-2">
              <VoiceInputButton onSpeechResult={(txt) => sendMessage(txt)} />
              <div className="flex-1">
                <InputBox onSend={sendMessage} disabled={isTyping} />
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Right Intelligence & Workflow Panel */}
        {showRightPanel && (
          <div className="w-80 border-l border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 overflow-y-auto space-y-4 shrink-0 scrollbar-thin">
            <LangGraphWorkflow />
            <RiskAnalysisCard />
            <IncidentSummaryCard />
            <RunbookReferencesPanel />
          </div>
        )}
      </div>
    </div>
  );
}
