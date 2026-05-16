'use client';

import { History, ExternalLink, CheckCircle2, Clock } from 'lucide-react';

interface Transaction {
    id: string;
    type: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: string;
    amount?: string;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
    return (
        <div className="glass-panel border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 p-6 rounded-3xl mt-12 overflow-hidden shadow-xl shadow-indigo-500/5">
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="bg-indigo-500/10 p-2.5 rounded-xl">
                    <History className="h-5 text-indigo-400 w-5" />
                </div>
                <div>
                    <h3 className="font-bold text-xl text-white">Recent Activity</h3>
                    <p className="text-xs text-indigo-200/40 font-medium tracking-wide uppercase">On-chain Transactions</p>
                </div>
            </div>

            <div className="space-y-1">
                {transactions.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-indigo-200/30 text-sm">No recent transactions found for this account.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] text-indigo-200/30 uppercase tracking-widest font-bold">
                                    <th className="pb-4 px-4 font-bold">Action</th>
                                    <th className="pb-4 px-4 font-bold">Status</th>
                                    <th className="pb-4 px-4 font-bold">Time</th>
                                    <th className="pb-4 px-4 text-right font-bold">Explorer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="font-semibold text-white text-sm">{tx.type}</div>
                                            {tx.amount && <div className="text-[11px] text-indigo-200/40">{tx.amount}</div>}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                {tx.status === 'confirmed' ? (
                                                    <>
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                                        <span className="text-xs text-emerald-400 font-medium">Confirmed</span>
                                                    </>
                                                ) : tx.status === 'pending' ? (
                                                    <>
                                                        <Clock className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                                                        <span className="text-xs text-amber-400 font-medium">Pending</span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-rose-400 font-medium">Failed</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-xs text-indigo-200/60 font-medium">
                                            {tx.timestamp}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <a
                                                href={`https://explorer.hiro.so/txid/${tx.id}?chain=mainnet`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white/5 border border-white/10 hover:bg-white/10 p-2 rounded-lg inline-flex text-indigo-200/60 transition-all"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
