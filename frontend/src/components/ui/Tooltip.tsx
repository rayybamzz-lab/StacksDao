'use client';

import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  tip: string;
}

export default function Tooltip({ children, tip }: TooltipProps) {
  return (
    <div className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {tip}
      </span>
    </div>
  );
}
