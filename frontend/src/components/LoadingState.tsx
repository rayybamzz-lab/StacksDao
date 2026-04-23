'use client';

import React from 'react';

interface LoadingStateProps {
  label?: string;
  description?: string;
}

export default function LoadingState({ label = 'Loading...', description }: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-[3px] border-indigo-200 dark:border-indigo-900 border-t-indigo-600 animate-spin" />
        <div className="absolute inset-0 h-10 w-10 rounded-full border-[3px] border-transparent border-t-indigo-400 opacity-30 animate-spin" style={{ animationDuration: '1.5s' }} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-slate-600 dark:text-zinc-300 animate-pulse">{label}</p>
        {description && (
          <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-xs text-center">{description}</p>
        )}
      </div>
    </div>
  );
}
