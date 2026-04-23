'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-zinc-900 mt-24 py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="font-bold tracking-tight text-slate-600 dark:text-zinc-400">StacksDAO Protocol</span>
        <p className="text-sm text-slate-500">Built on Stacks</p>
      </div>
    </footer>
  );
}
