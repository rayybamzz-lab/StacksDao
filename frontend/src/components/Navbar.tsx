'use client';

import React from 'react';

interface NavbarProps {
  address?: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function Navbar({ address, onConnect, onDisconnect }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="font-bold text-lg">StacksDAO</span>
        {address ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{address.slice(0, 6)}...{address.slice(-4)}</span>
            <button onClick={onDisconnect} className="h-9 px-4 rounded-full bg-slate-100 dark:bg-zinc-800 text-sm font-medium hover:bg-slate-200">Disconnect</button>
          </div>
        ) : (
          <button onClick={onConnect} className="h-9 px-6 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Connect</button>
        )}
      </div>
    </nav>
  );
}
