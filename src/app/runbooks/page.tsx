'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { RunbookTable } from '@/components/runbook/RunbookTable';
import { PreviewCard } from '@/components/runbook/PreviewCard';
import { UploadForm } from '@/components/forms/UploadForm';
import { SearchForm } from '@/components/forms/SearchForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useRunbookStore } from '@/store/runbook-store';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Upload } from 'lucide-react';
import { Runbook } from '@/types/runbook';

export default function RunbooksPage() {
  const { isCollapsed } = useSidebarStore();
  const { runbooks, deleteRunbook } = useRunbookStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewRunbook, setPreviewRunbook] = useState<Runbook | null>(null);

  const filtered = runbooks.filter((rb) => {
    const matchesSearch = rb.title.toLowerCase().includes(searchQuery.toLowerCase()) || rb.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || rb.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Runbook Document Vault"
            description="Manage operational runbooks, view extracted steps, and index semantic embeddings in ChromaDB."
            action={
              <Button variant="glow" size="md" onClick={() => setIsUploadModalOpen(true)} leftIcon={<Upload className="h-4 w-4" />}>
                Upload New Runbook
              </Button>
            }
          />

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl shadow-xs">
            <SearchForm placeholder="Search runbook title, tags, or commands..." onSearch={setSearchQuery} className="max-w-md" />

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['ALL', 'Database', 'Infrastructure', 'Web Services'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Runbooks Table */}
          <RunbookTable
            runbooks={filtered}
            onDelete={deleteRunbook}
            onPreview={(rb) => setPreviewRunbook(rb)}
          />
        </div>
      </main>

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Runbook Document">
        <UploadForm onSuccess={() => setIsUploadModalOpen(false)} />
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewRunbook}
        onClose={() => setPreviewRunbook(null)}
        title={`Parsed Steps - ${previewRunbook?.title || ''}`}
      >
        {previewRunbook && <PreviewCard runbook={previewRunbook} />}
      </Modal>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
