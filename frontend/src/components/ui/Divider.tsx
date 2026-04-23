'use client';

import React from 'react';

interface DividerProps {
  label?: string;
}

export default function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
      {label && <span className="text-xs text-slate-500">{label}</span>}
      <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
    </div>
  );
}
