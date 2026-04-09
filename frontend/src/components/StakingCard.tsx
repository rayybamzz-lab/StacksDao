'use client';

import { Trophy } from 'lucide-react';

interface StakingCardProps {
    totalStaked: number;
    rewardRate: number;
    isStaking?: boolean;
    onAction: () => void;
}

export default function StakingCard({ totalStaked, rewardRate, isStaking, onAction }: StakingCardProps) {
    return (
        <div className="glass-panel border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-2xl flex flex-col h-full">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 flex h-12 items-center justify-center mb-6 rounded-xl text-emerald-600 w-12 shrink-0">
                <Trophy className="h-6 w-6" />
            </div>

            <div className="flex-grow">
                <h3 className="font-bold mb-2 text-xl text-white">Passive Staking</h3>
                <p className="dark:text-zinc-400 mb-6 text-slate-500 text-sm leading-relaxed">
                    Lock your NFTs in our secure vault and earn SDAO tokens every block. Rewards accrue automatically.
                </p>
            </div>

            <div className="border-slate-100 border-t dark:border-zinc-800 pt-4 space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-zinc-500">Yield</span>
                    <span className="font-bold text-emerald-500">{rewardRate} SDAO / Block</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-zinc-500">Total Staked</span>
                    <span className="font-medium text-white">{totalStaked} NFTs</span>
                </div>
                <button
                    onClick={onAction}
                    aria-label={isStaking ? "Manage staking" : "Go to staking vault"}
                    className="bg-slate-900 dark:bg-zinc-100 dark:text-black font-bold h-11 mt-2 rounded-xl text-sm text-white w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isStaking ? "Manage Staking" : "Go to Vault"}
                </button>
            </div>
        </div>
    );
}
