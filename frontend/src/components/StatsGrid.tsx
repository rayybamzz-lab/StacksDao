'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

interface StatsGridProps {
  stats: Stat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className="group rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase tracking-wide">{s.label}</p>
              {Icon && (
                <Icon className="h-4 w-4 text-slate-300 dark:text-zinc-600 group-hover:text-indigo-400 transition-colors" />
              )}
            </div>
            <div className="flex items-end gap-2">
              <p className="text-xl font-bold text-slate-900 dark:text-zinc-100">{s.value}</p>
              {s.trend === 'up' && <span className="text-[10px] font-semibold text-emerald-500 mb-1">+</span>}
              {s.trend === 'down' && <span className="text-[10px] font-semibold text-red-500 mb-1">-</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
