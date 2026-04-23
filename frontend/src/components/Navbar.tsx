'use client';

import React, { useState } from 'react';
import { Menu, X, Wallet, LogOut } from 'lucide-react';

interface NavbarProps {
  address?: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function Navbar({ address, onConnect, onDisconnect }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="font-bold text-lg">StacksDAO</span>

        {/* Desktop wallet */}
        <div className="hidden sm:flex items-center gap-3">
          {address ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{address.slice(0, 6)}...{address.slice(-4)}</span>
              <button
                onClick={onDisconnect}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-slate-100 dark:bg-zinc-800 text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="inline-flex items-center gap-2 h-9 px-6 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Wallet className="h-4 w-4" />
              Connect
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-slate-100 dark:border-zinc-900 px-4 py-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
          {address ? (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-slate-600 dark:text-zinc-300">{address.slice(0, 6)}...{address.slice(-4)}</span>
              <button
                onClick={() => { onDisconnect(); setMobileOpen(false); }}
                className="inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-slate-100 dark:bg-zinc-800 text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => { onConnect(); setMobileOpen(false); }}
              className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
