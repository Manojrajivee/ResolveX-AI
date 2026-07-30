'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/hooks/useSidebar';

export const KeyboardShortcutsHandler: React.FC = () => {
  const router = useRouter();
  const { toggleCollapse } = useSidebarStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            toggleCollapse();
            break;
          case '/':
            e.preventDefault();
            router.push('/dashboard/chat');
            break;
          case 'd':
            e.preventDefault();
            router.push('/dashboard');
            break;
          case 'r':
            e.preventDefault();
            router.push('/dashboard/runbooks');
            break;
          case 'a':
            e.preventDefault();
            router.push('/dashboard/analytics');
            break;
          case 'n':
            e.preventDefault();
            router.push('/dashboard/notifications');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, toggleCollapse]);

  return null;
};
