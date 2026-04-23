'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'neutral';
}

export default function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const map = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-indigo-100 text-indigo-700',
    neutral: 'bg-slate-100 text-slate-700',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[variant]}`}>{children}</span>;
}
