'use client';

import React from 'react';

interface Stat { label: string; value: string; }

interface StatsGridProps { stats: Stat[]; }

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">{s.label}</p>
          <p className="text-xl font-bold mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
