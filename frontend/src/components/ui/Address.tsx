'use client';

import React, { useState } from 'react';
import { formatAddress, cn } from '@/lib/utils';

interface AddressDisplayProps {
  address: string;
  showFull?: boolean;
  truncate?: boolean;
  className?: string;
}

export function AddressDisplay({ 
  address, 
  showFull = false, 
  truncate = true,
  className 
}: AddressDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);

  const displayAddress = showFull || !truncate ? address : formatAddress(address);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md',
        'hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors',
        'font-mono text-sm',
        className
      )}
      title="Click to copy"
    >
      <span>{displayAddress}</span>
      {isCopied ? (
        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

interface NetworkStatusProps {
  network: 'mainnet' | 'testnet' | 'devnet';
  connected?: boolean;
}

export function NetworkStatus({ network, connected = true }: NetworkStatusProps) {
  const colors = {
    mainnet: 'bg-emerald-500',
    testnet: 'bg-amber-500',
    devnet: 'bg-blue-500',
  };

  const labels = {
    mainnet: 'Mainnet',
    testnet: 'Testnet',
    devnet: 'Devnet',
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800">
      <span className={cn('w-2 h-2 rounded-full', colors[network], connected && 'animate-pulse')} />
      <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
        {labels[network]}
      </span>
    </div>
  );
}
