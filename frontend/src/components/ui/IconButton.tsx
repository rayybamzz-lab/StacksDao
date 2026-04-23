'use client';

import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function IconButton({ label, children, className = '', ...props }: IconButtonProps) {
  return (
    <button aria-label={label} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors ${className}`} {...props}>
      {children}
    </button>
  );
}
