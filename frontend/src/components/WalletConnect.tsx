'use client';

import React from 'react';

interface WalletConnectProps {
  onConnect: () => void;
  loading?: boolean;
}

export default function WalletConnect({ onConnect, loading }: WalletConnectProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h2 className="text-xl font-bold mb-2">Connect Wallet</h2>
      <p className="text-sm text-slate-500 mb-6">Connect your Stacks wallet to interact with the protocol</p>
      <button onClick={onConnect} disabled={loading} className="h-12 px-8 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50">
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
}
