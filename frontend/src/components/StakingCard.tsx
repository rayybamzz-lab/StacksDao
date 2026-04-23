'use client';

import React from 'react';

interface StakingCardProps {
  tokenId: number;
  rewards: number;
  onStake: () => void;
  onUnstake: () => void;
  onClaim: () => void;
  isStaked: boolean;
}

export default function StakingCard({ tokenId, rewards, onStake, onUnstake, onClaim, isStaked }: StakingCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <h3 className="text-lg font-bold mb-2">Token #{tokenId}</h3>
      <p className="text-sm text-slate-500 mb-4">Rewards: {rewards} SDAO</p>
      {isStaked ? (
        <div className="flex gap-2">
          <button onClick={onClaim} className="flex-1 h-10 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700">Claim</button>
          <button onClick={onUnstake} className="flex-1 h-10 rounded-lg bg-slate-600 text-white font-medium hover:bg-slate-700">Unstake</button>
        </div>
      ) : (
        <button onClick={onStake} className="w-full h-10 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">Stake</button>
      )}
    </div>
  );
}
