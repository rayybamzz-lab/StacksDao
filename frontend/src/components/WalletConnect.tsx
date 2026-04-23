'use client';

import React from 'react';
import { Wallet, ArrowRight } from 'lucide-react';

interface WalletConnectProps {
  onConnect: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export default function WalletConnect({ onConnect, loading, title = 'Connect Wallet', description = 'Connect your Stacks wallet to interact with the protocol' }: WalletConnectProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl mb-6">
        <Wallet className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-zinc-100">{title}</h2>
      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 max-w-xs">{description}</p>
      <button
        onClick={onConnect}
        disabled={loading}
        className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
      >
        {loading ? 'Connecting...' : 'Connect Wallet'}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  );
}
