'use client';

import { Vote, ShieldCheck, Clock } from 'lucide-react';

interface ProposalCardProps {
    proposal: {
        id: number;
        title: string;
        description: string;
        votesFor: number;
        votesAgainst: number;
        endBlock: number;
        executed: boolean;
    };
    currentBlock: number;
    onVote: (id: number, inFavor: boolean) => void;
    onExecute: (id: number) => void;
}

export default function ProposalCard({ proposal, currentBlock, onVote, onExecute }: ProposalCardProps) {
    const isVotingEnded = currentBlock > proposal.endBlock;
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

    return (
        <div className="flex flex-col gap-4 glass-panel p-6 rounded-2xl">
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-bold text-lg text-white underline-offset-4 decoration-indigo-500/30">
                        #{proposal.id}: {proposal.title}
                    </h4>
                    <p className="line-clamp-2 mt-1 text-indigo-200/60 text-sm">
                        {proposal.description}
                    </p>
                </div>
                {proposal.executed ? (
                    <span className="bg-emerald-500/10 flex gap-1 h-fit items-center px-2 py-1 rounded text-[10px] text-emerald-400">
                        <ShieldCheck className="h-3 w-3" />
                        EXECUTED
                    </span>
                ) : isVotingEnded ? (
                    <span className="bg-amber-500/10 flex gap-1 h-fit items-center px-2 py-1 rounded text-[10px] text-amber-400">
                        <Clock className="h-3 w-3" />
                        ENDED
                    </span>
                ) : (
                    <span className="bg-indigo-500/10 flex gap-1 h-fit items-center px-2 py-1 rounded text-[10px] text-indigo-400">
                        <Vote className="h-3 w-3" />
                        ACTIVE
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-indigo-200/40">Approval</span>
                    <span className="font-medium text-white">{forPercentage.toFixed(1)}%</span>
                </div>
                <div className="bg-white/5 h-1.5 overflow-hidden rounded-full w-full">
                    <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${forPercentage}%` }}
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                {!isVotingEnded ? (
                    <>
                        <button
                            onClick={() => onVote(proposal.id, true)}
                            className="bg-indigo-500/10 border border-indigo-500/20 flex-1 font-bold h-9 hover:bg-indigo-500/20 rounded-lg text-indigo-400 text-xs transition-all"
                        >
                            Vote For
                        </button>
                        <button
                            onClick={() => onVote(proposal.id, false)}
                            className="bg-white/5 border border-white/10 flex-1 font-bold h-9 hover:bg-white/10 rounded-lg text-white/60 text-xs transition-all"
                        >
                            Against
                        </button>
                    </>
                ) : !proposal.executed && (
                    <button
                        onClick={() => onExecute(proposal.id)}
                        className="bg-indigo-600 flex-1 font-bold h-9 hover:bg-indigo-700 rounded-lg text-sm text-white transition-all shadow-lg shadow-indigo-600/20"
                    >
                        Execute Proposal
                    </button>
                )}
            </div>
        </div>
    );
}
