'use client';

import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export default function ProgressBar({ value, max = 100, className = '' }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={`h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden ${className}`}>
      <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: pct + '%' }} />
    </div>
  );
}
