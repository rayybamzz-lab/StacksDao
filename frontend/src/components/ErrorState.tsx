'use client';

import React from 'react';

interface ErrorStateProps { message: string; onRetry?: () => void; }

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <p className="text-red-500 font-medium">{message}</p>
      {onRetry && <button onClick={onRetry} className="h-9 px-4 rounded-lg bg-slate-100 text-sm font-medium hover:bg-slate-200">Retry</button>}
    </div>
  );
}
