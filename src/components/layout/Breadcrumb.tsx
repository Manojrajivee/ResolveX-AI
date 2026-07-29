'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
      <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 font-medium">
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const formatted = segment.replace(/-/g, ' ');

        return (
          <React.Fragment key={url}>
            <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600" />
            {isLast ? (
              <span className="font-bold text-blue-600 dark:text-blue-400 capitalize">{formatted}</span>
            ) : (
              <Link href={url} className="hover:text-slate-900 dark:hover:text-white capitalize transition-colors font-medium">
                {formatted}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
