export const PACKAGE_NAME = '@stacksdao/types';
export const PACKAGE_SCOPE = 'types';

export const packageMetadata = {
  name: PACKAGE_NAME,
  scope: PACKAGE_SCOPE,
} as const;
export type ProposalStatus = 'active' | 'passed' | 'rejected' | 'executed';
export interface Proposal { id: number; title: string; description: string; status: ProposalStatus; proposer: string; startBlock: number; endBlock: number; votesFor: number; votesAgainst: number; executed: boolean; }
