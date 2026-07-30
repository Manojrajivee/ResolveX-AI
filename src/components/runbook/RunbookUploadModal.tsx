'use client';

import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: (runbookData: any) => void;
}

export const RunbookUploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [completed, setCompleted] = useState(false);

  const simulateUpload = (fileName: string) => {
    setIsUploading(true);
    setProgress(15);
    setCompleted(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setCompleted(true);
          if (onUploadSuccess) {
            onUploadSuccess({
              id: `rb-${Date.now()}`,
              title: fileName.replace(/\.[^/.]+$/, '').replace(/-/g, ' '),
              description: 'Newly uploaded enterprise operational runbook with RAG vector indexing.',
              format: fileName.endsWith('.pdf') ? 'PDF' : fileName.endsWith('.txt') ? 'TXT' : 'MARKDOWN',
              filePath: `/uploads/${fileName}`,
              fileSize: '420 KB',
              uploadedBy: 'Current SRE User',
              uploadedAt: new Date().toISOString(),
              chunksCount: 15,
              category: 'Custom Upload',
              tags: ['uploaded', 'sre', 'custom'],
              steps: [
                { stepNumber: 1, title: 'Check System Status', command: 'uptime', description: 'Check system uptime.', riskLevel: 'SAFE' },
              ],
            });
          }
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-6 space-y-6 backdrop-blur-xl z-10 text-slate-900 dark:text-slate-100"
        >
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Upload Runbook to Vault</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">PDF, Markdown, TXT, DOCX, JSON, YAML up to 25MB</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) simulateUpload(file.name);
            }}
            className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-3 transition-colors ${
              dragOver
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40'
            }`}
          >
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Drag & drop files here</p>
              <p className="text-xs text-slate-400">or click to browse from computer</p>
            </div>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) simulateUpload(file.name);
              }}
              className="hidden"
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input">
              <Button size="sm" variant="outline" type="button" className="cursor-pointer">
                Select File
              </Button>
            </label>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                  <Loader2 className="h-4 w-4 animate-spin" /> Vectorizing Document...
                </span>
                <span className="font-bold">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {completed && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Document indexed successfully! Added to ChromaDB RAG Vector Store.</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {completed && (
              <Button variant="glow" onClick={onClose}>
                Done
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
