'use client';

import React from 'react';
import ProposalCard from './ProposalCard';

interface Proposal {
  id: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  endBlock: number;
  executed: boolean;
}

interface ProposalListProps {
  proposals: Proposal[];
  currentBlock: number;
  onVote: (id: number, inFavor: boolean) => void;
  onExecute: (id: number) => void;
}

export default function ProposalList({ proposals, currentBlock, onVote, onExecute }: ProposalListProps) {
  return (
    <div className="grid gap-4">
      {proposals.map(p => (
        <ProposalCard key={p.id} proposal={p} currentBlock={currentBlock} onVote={onVote} onExecute={onExecute} />
      ))}
    </div>
  );
}
