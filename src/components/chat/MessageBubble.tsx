'use client';

import React from 'react';
import { ChatMessage } from '@/types/chat';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Bot, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface MessageBubbleProps {
  message: ChatMessage;
  onApproveCommand?: (command: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onApproveCommand }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 my-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className="shrink-0">
        {isUser ? (
          <Avatar name="User" size="sm" className="bg-blue-600 text-white border-blue-400" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
            <Bot className="h-4 w-4" />
          </div>
        )}
      </div>

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed border shadow-xs ${
          isUser
            ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none font-medium'
            : 'bg-white/90 dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none shadow-md backdrop-blur-md'
        }`}
      >
        <div className={`flex items-center justify-between gap-4 mb-2 pb-1.5 border-b font-mono text-[10px] ${
          isUser ? 'border-blue-500/40 text-blue-100' : 'border-slate-200/80 dark:border-slate-800/80 text-slate-400'
        }`}>
          <span className="font-bold">{isUser ? 'SRE Engineer' : 'Runbook AI Agent'}</span>
          <span>{formatDate(message.timestamp)}</span>
        </div>

        <div className="whitespace-pre-wrap font-sans leading-relaxed">{message.content}</div>

        {/* Risky Operation Intercept Box */}
        {message.requiresApproval && message.pendingCommand && (
          <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
              <ShieldAlert className="h-4 w-4" />
              <span>Human Approval Required (Risky Shell Command)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">{message.pendingCommand.explanation}</p>
            <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 shadow-inner">
              $ {message.pendingCommand.command}
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                variant="danger"
                size="sm"
                onClick={() => onApproveCommand && onApproveCommand(message.pendingCommand!.command)}
                leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
              >
                Approve & Execute Command
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
