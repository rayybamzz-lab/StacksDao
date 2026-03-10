'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export function Divider({ orientation = 'horizontal', label }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className="h-full w-px bg-slate-200 dark:bg-zinc-700" />;
  }

  if (label) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-700" />
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wide">{label}</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-700" />
      </div>
    );
  }

  return <div className="h-px bg-slate-200 dark:bg-zinc-700" />;
}

interface CardGroupProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function CardGroup({ children, columns = 2 }: CardGroupProps) {
  const columnsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return <div className={cn('grid gap-6', columnsClass[columns])}>{children}</div>;
}
