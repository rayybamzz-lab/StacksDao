'use client';

import { Flame } from 'lucide-react';

interface MinterCardProps {
    price: string;
    mintedCount: number;
    maxSupply: number;
    isMinting: boolean;
    onMint: () => void;
}

export default function MinterCard({ price, mintedCount, maxSupply, isMinting, onMint }: MinterCardProps) {
    const progress = (mintedCount / maxSupply) * 100;

    return (
        <div className="glass-panel border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-2xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="bg-orange-500/10 p-3 rounded-xl">
                    <Flame className="h-6 text-orange-400 w-6" />
                </div>
                <span className="bg-orange-500/10 font-bold px-3 py-1 rounded-full text-orange-400 text-[10px] tracking-wider uppercase">
                    SIP-009 Standard
                </span>
            </div>

            <div className="flex-grow">
                <h3 className="font-bold mb-1 text-2xl text-white">Mint Stacks NFT</h3>
                <p className="text-indigo-200/60 text-sm mb-6">Sequential issuance. Limit 5 per TX.</p>
            </div>

            <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-indigo-200/40">Price</span>
                        <span className="font-bold text-white tracking-tight">{price}</span>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="text-indigo-200/40 uppercase tracking-widest">Supply Progress</span>
                            <span className="font-medium text-white">{mintedCount.toLocaleString()} / {maxSupply.toLocaleString()}</span>
                        </div>
                        <div className="bg-white/5 h-1.5 overflow-hidden rounded-full w-full">
                            <div
                                className="bg-orange-500 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={onMint}
                    disabled={isMinting}
                    className="bg-white disabled:opacity-50 flex font-bold h-12 hover:bg-orange-50 items-center justify-center rounded-xl text-indigo-950 transition-all hover:scale-[1.02] active:scale-[0.98] w-full"
                    aria-label={`Mint NFT for ${price}`}
                >
                    {isMinting ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-indigo-950 border-t-transparent animate-spin rounded-full" />
                            <span>Minting...</span>
                        </div>
                    ) : 'Mint Now'}
                </button>
            </div>
        </div>
    );
}
