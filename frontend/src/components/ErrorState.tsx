'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorState({ message, onRetry, title = 'Something went wrong' }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
        <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" aria-hidden="true" />
      </div>
      <div className="flex flex-col items-center gap-1 max-w-sm text-center">
        <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{title}</p>
        <p className="text-sm text-slate-500 dark:text-zinc-400">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-slate-100 dark:bg-zinc-800 text-sm font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Retry failed operation"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}
