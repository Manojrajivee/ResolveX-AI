'use client';

import React from 'react';
import { Runbook } from '@/types/runbook';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FileText, Eye, Trash2, Play } from 'lucide-react';
import Link from 'next/link';

export interface RunbookTableProps {
  runbooks: Runbook[];
  onDelete: (id: string) => void;
  onPreview: (runbook: Runbook) => void;
}

export const RunbookTable: React.FC<RunbookTableProps> = ({ runbooks, onDelete, onPreview }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-xs">
      <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
        <thead className="bg-slate-100/80 dark:bg-slate-950/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
          <tr>
            <th className="py-3.5 px-4">Runbook Document</th>
            <th className="py-3.5 px-4">Format</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Size / Chunks</th>
            <th className="py-3.5 px-4">Uploaded By</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
          {runbooks.map((rb) => (
            <tr key={rb.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rb.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{rb.description}</p>
                  </div>
                </div>
              </td>

              <td className="py-3.5 px-4">
                <Badge variant={rb.format === 'PDF' ? 'purple' : rb.format === 'MARKDOWN' ? 'info' : 'neutral'} size="sm">
                  {rb.format}
                </Badge>
              </td>

              <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-300">{rb.category}</td>

              <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {rb.fileSize} ({rb.chunksCount} chunks)
              </td>

              <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">{rb.uploadedBy}</td>

              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button variant="ghost" size="sm" onClick={() => onPreview(rb)} title="Quick Preview">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Link href="/chat">
                    <Button variant="outline" size="sm" leftIcon={<Play className="h-3 w-3" />}>
                      Trigger Incident
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(rb.id)} className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
