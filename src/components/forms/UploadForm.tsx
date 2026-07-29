'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { RunbookService } from '@/services/runbook.service';
import { useRunbookStore } from '@/store/runbook-store';

export const UploadForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { addRunbook } = useRunbookStore();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Database');
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select or drop a runbook document.');
      return;
    }

    setErrorMsg('');
    setIsUploading(true);
    try {
      const newRunbook = await RunbookService.uploadRunbook(file, title, category);
      addRunbook(newRunbook);
      setSuccessMsg(`"${newRunbook.title}" uploaded & indexed in ChromaDB successfully!`);
      setFile(null);
      setTitle('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg('Failed to parse document.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      {successMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500/60 rounded-2xl bg-slate-50/50 dark:bg-slate-900/60 transition-all cursor-pointer group text-center"
      >
        <div className="p-3.5 bg-blue-500/10 dark:bg-slate-800 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform mb-3 border border-blue-500/20">
          <Upload className="h-6 w-6" />
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">Drag & drop runbook file here</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Supports PDF, Markdown (.md), or Plain Text (.txt)</p>

        <label className="mt-4 cursor-pointer">
          <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 shadow-2xs">
            Browse File
          </span>
          <input type="file" accept=".pdf,.md,.txt" onChange={handleFileSelect} className="hidden" />
        </label>

        {file && (
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <FileText className="h-4 w-4" />
            <span className="font-mono">{file.name}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Runbook Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Postgres Failover Guide"
            className="w-full rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-medium"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-medium"
          >
            <option value="Database">Database Operations</option>
            <option value="Infrastructure">Kubernetes & Infrastructure</option>
            <option value="Web Services">Web Servers & Networking</option>
            <option value="Security">Security & Access</option>
          </select>
        </div>
      </div>

      <Button type="submit" variant="glow" size="md" className="w-full mt-2" isLoading={isUploading} leftIcon={<Upload className="h-4 w-4" />}>
        Parse & Index Runbook in Vector Store
      </Button>
    </form>
  );
};
