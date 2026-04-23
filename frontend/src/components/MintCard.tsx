'use client';

import React from 'react';

interface MintCardProps {
  price: number;
  supply: { minted: number; max: number };
  onMint: () => void;
  loading?: boolean;
}

export default function MintCard({ price, supply, onMint, loading }: MintCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <h3 className="text-lg font-bold mb-2">Mint NFT</h3>
      <p className="text-sm text-slate-500 mb-4">Price: {(price / 1_000_000).toFixed(2)} STX</p>
      <p className="text-sm text-slate-500 mb-4">Supply: {supply.minted} / {supply.max}</p>
      <button onClick={onMint} disabled={loading} className="w-full h-10 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50">
        {loading ? 'Minting...' : 'Mint Now'}
      </button>
    </div>
  );
}
