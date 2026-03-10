'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export function Tabs({ tabs, defaultTab, variant = 'default' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  const variants = {
    default: 'bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg',
    pills: 'gap-2',
    underline: 'border-b border-slate-200 dark:border-zinc-700 gap-4',
  };

  const tabStyles = {
    default: (isActive: boolean) => cn(
      'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-sm'
        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
    ),
    pills: (isActive: boolean) => cn(
      'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
    ),
    underline: (isActive: boolean) => cn(
      'pb-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px',
      isActive
        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200'
    ),
  };

  return (
    <div>
      <div className={cn('flex', variants[variant])}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              tabStyles[variant](activeTab === tab.id),
              'flex items-center gap-2'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeContent}
      </div>
    </div>
  );
}
