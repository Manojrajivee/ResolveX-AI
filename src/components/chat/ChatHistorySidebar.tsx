'use client';

import React, { useState } from 'react';
import { Plus, Search, Pin, Star, Folder, MessageSquare, Trash2, Edit2, Share2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';

export interface ChatSessionItem {
  id: string;
  title: string;
  timestamp: string;
  isPinned?: boolean;
  isFavorite?: boolean;
  folder?: string;
  snippet: string;
}

const INITIAL_SESSIONS: ChatSessionItem[] = [
  { id: 'sess-1', title: 'PostgreSQL Primary Crash', timestamp: '10m ago', isPinned: true, isFavorite: true, folder: 'Databases', snippet: 'PostgreSQL connection pool exhausted on port 5432' },
  { id: 'sess-2', title: 'K8s OOMKilled Pod Debugging', timestamp: '2h ago', isPinned: true, folder: 'Kubernetes', snippet: 'Out of memory container exit code 137' },
  { id: 'sess-3', title: 'Nginx 502 Gateway Investigation', timestamp: 'Yesterday', isFavorite: true, folder: 'Networking', snippet: 'Upstream connection reset by peer during peak traffic' },
  { id: 'sess-4', title: 'Redis Cluster Memory Alert', timestamp: '3 days ago', snippet: 'Maxmemory policy eviction rate spike' },
];

interface ChatHistorySidebarProps {
  activeId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  activeId,
  onSelectSession,
  onNewChat,
}) => {
  const [sessions, setSessions] = useState<ChatSessionItem[]>(INITIAL_SESSIONS);
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const filtered = sessions.filter(
    (s) =>
      (!selectedFolder || s.folder === selectedFolder) &&
      (s.title.toLowerCase().includes(search.toLowerCase()) || s.snippet.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-72 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex flex-col h-full shrink-0">
      {/* Header & New Chat */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 space-y-3">
        <Button
          onClick={onNewChat}
          variant="glow"
          className="w-full justify-center gap-2 font-semibold shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Session</span>
        </Button>

        {/* Search */}
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Folders & History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin text-xs">
        {/* Folders Pill */}
        <div className="space-y-1">
          <div className="px-2 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Folders</div>
          <div className="flex flex-wrap gap-1">
            {['Databases', 'Kubernetes', 'Networking'].map((folder) => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(selectedFolder === folder ? null : folder)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-medium text-[11px]',
                  selectedFolder === folder
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                <Folder className="h-3 w-3" />
                <span>{folder}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Chats */}
        <div className="space-y-1">
          <div className="px-2 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Pin className="h-3 w-3 text-amber-500" /> Pinned Sessions
          </div>
          {filtered
            .filter((s) => s.isPinned)
            .map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  'p-2.5 rounded-xl transition-all cursor-pointer space-y-1 group relative border',
                  activeId === session.id
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500/40 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold truncate text-slate-900 dark:text-slate-100 pr-2">{session.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{session.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{session.snippet}</p>
              </div>
            ))}
        </div>

        {/* All Sessions */}
        <div className="space-y-1">
          <div className="px-2 font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Recent Conversations</span>
            <span className="text-[10px] text-slate-400 font-bold">{filtered.length}</span>
          </div>
          {filtered.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={cn(
                'p-2.5 rounded-xl transition-all cursor-pointer space-y-1 group relative border',
                activeId === session.id
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500/40 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                  : 'bg-white dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium truncate text-slate-900 dark:text-slate-100 pr-2">{session.title}</span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{session.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{session.snippet}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
