'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-slate-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatsCard({ label, value, change, icon, trend }: StatsCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            {icon}
          </div>
        )}
        {change !== undefined && (
          <span className={cn(
            'text-sm font-medium',
            trend === 'up' ? 'text-emerald-500' :
            trend === 'down' ? 'text-red-500' : 'text-slate-500'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-1">
        {value}
      </div>
      <div className="text-sm text-slate-500 dark:text-zinc-400">
        {label}
      </div>
    </div>
  );
}
