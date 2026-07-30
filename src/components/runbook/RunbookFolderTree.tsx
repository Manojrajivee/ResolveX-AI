'use client';

import React, { useState } from 'react';
import { Folder, ChevronRight, ChevronDown, Plus, Star, History, Trash2, Shield, Server, Cpu, Database, Cloud, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FolderNode {
  id: string;
  name: string;
  count: number;
  icon?: any;
  subFolders?: FolderNode[];
}

const INITIAL_FOLDERS: FolderNode[] = [
  { id: 'f-1', name: 'Database Systems', count: 14, icon: Database },
  { id: 'f-2', name: 'Kubernetes & Docker', count: 28, icon: Server },
  { id: 'f-3', name: 'Linux Operations', count: 19, icon: Terminal },
  { id: 'f-4', name: 'Cloud Infrastructure', count: 12, icon: Cloud },
  { id: 'f-5', name: 'Security & Compliance', count: 9, icon: Shield },
];

interface FolderTreeProps {
  selectedFolder: string | null;
  onSelectFolder: (id: string | null) => void;
}

export const RunbookFolderTree: React.FC<FolderTreeProps> = ({ selectedFolder, onSelectFolder }) => {
  const [folders, setFolders] = useState<FolderNode[]>(INITIAL_FOLDERS);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'f-1': true, 'f-2': true });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-4 space-y-4 shrink-0 font-sans text-xs">
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-xs uppercase tracking-wider text-slate-400 font-mono">Vault Navigation</span>
        <button
          onClick={() => {
            const name = prompt('New Folder Name:');
            if (name) {
              setFolders((prev) => [...prev, { id: `f-${Date.now()}`, name, count: 0, icon: Folder }]);
            }
          }}
          className="p-1 text-slate-400 hover:text-blue-500 rounded-md transition-colors"
          title="Create New Folder"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Filters */}
      <div className="space-y-1">
        <button
          onClick={() => onSelectFolder(null)}
          className={cn(
            'flex w-full items-center justify-between px-3 py-2 rounded-xl transition-all font-semibold',
            selectedFolder === null
              ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-blue-500" />
            <span>All Documents</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">62</span>
        </button>

        <button
          onClick={() => onSelectFolder('fav')}
          className={cn(
            'flex w-full items-center justify-between px-3 py-2 rounded-xl transition-all font-semibold',
            selectedFolder === 'fav'
              ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            <span>Favorites</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">8</span>
        </button>
      </div>

      {/* Folders List */}
      <div className="space-y-1 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="px-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Folders</div>
        {folders.map((f) => {
          const Icon = f.icon || Folder;
          const isSelected = selectedFolder === f.id;

          return (
            <div key={f.id} className="space-y-1">
              <button
                onClick={() => onSelectFolder(f.id)}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 rounded-xl transition-all font-medium',
                  isSelected
                    ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="truncate">{f.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{f.count}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
